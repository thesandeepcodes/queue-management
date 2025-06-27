import mongoose from "mongoose";
import Event from "../models/Event.js";
import Queue from "../models/Queue.js";
import createResponse from "../lib/Response.js";
import HTTP from "../lib/HTTP.js";
import AppError from "../errors/AppError.js";
import { moveQueueSchema } from "../schemas/queueSchema.js";

export async function getQueue(req, res, next) {
  try {
    const { eventId } = req.params;

    if (!mongoose.isValidObjectId(eventId)) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Invalid event ID")
      );
    }

    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError(
        HTTP.NOT_FOUND,
        createResponse(false, "Event not found")
      );
    }

    const queues = await Queue.find({ event: eventId });

    return res.json(
      createResponse(true, "Queues fetched successfully", {
        queues: queues
          .map((queue) => ({
            ...queue.toObject(),
            position: event.queues.indexOf(queue._id),
          }))
          .sort((a, b) => a.position - b.position),
      })
    );
  } catch (e) {
    next(e);
  }
}

export async function moveQueue(req, res, next) {
  try {
    const { eventId } = req.params;

    if (!mongoose.isValidObjectId(eventId)) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Invalid event ID")
      );
    }

    const result = moveQueueSchema.safeParse(req.body);
    if (!result.success) throw result.error;

    const { positions } = result.data;

    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError(
        HTTP.NOT_FOUND,
        createResponse(false, "Event not found")
      );
    }

    function applyPositionsMap(array, positions) {
      const newQueues = [...array];

      for (const from in positions) {
        const to = positions[from];

        newQueues.splice(to, 0, newQueues.splice(from, 1)[0]);
      }

      return newQueues;
    }

    event.queues = applyPositionsMap(event.queues, positions);
    await event.save();

    return res.json(
      createResponse(true, "Guest moved in queue", {
        queues: event.queues,
        positions,
      })
    );
  } catch (e) {
    next(e);
  }
}

export async function serveQueue(req, res, next) {
  try {
    const { eventId } = req.params;
    const { guestId } = req.body;

    if (!mongoose.isValidObjectId(eventId)) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Invalid event ID")
      );
    }

    if (!mongoose.isValidObjectId(guestId)) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Invalid guest ID")
      );
    }

    const [event, queue] = await Promise.all([
      Event.findById(eventId),
      Queue.findById(guestId),
    ]);

    if (!event) {
      throw new AppError(
        HTTP.NOT_FOUND,
        createResponse(false, "Event not found")
      );
    }

    if (!queue) {
      throw new AppError(
        HTTP.NOT_FOUND,
        createResponse(false, "Guest not found")
      );
    }

    const guestIndex = event.queues.indexOf(guestId);

    if (guestIndex === -1) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Guest not found in event")
      );
    }

    queue.served = true;
    queue.queueTime = Date.now() - queue.joinedAt.getTime();

    event.currentPosition = guestIndex + 1;

    if (event.currentPosition > event.queues.length - 1) {
      if (event.queues.length > 1) {
        event.currentPosition = event.queues.length - 1;
      } else {
        event.currentPosition = 0;
      }
    }

    await event.save();
    await queue.save();
    return res.json(createResponse(true, "Guest marked as served"));
  } catch (e) {
    next(e);
  }
}

export async function deleteQueue(req, res, next) {
  try {
    const { guestId } = req.params;
    const { eventId } = req.body;

    if (!mongoose.isValidObjectId(eventId)) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Invalid event ID")
      );
    }

    if (!mongoose.isValidObjectId(guestId)) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Invalid guest ID")
      );
    }

    const [event, queue] = await Promise.all([
      Event.findById(eventId),
      Queue.findById(guestId),
    ]);

    if (!event) {
      throw new AppError(
        HTTP.NOT_FOUND,
        createResponse(false, "Event not found")
      );
    }

    if (!queue) {
      throw new AppError(
        HTTP.NOT_FOUND,
        createResponse(false, "Guest not found")
      );
    }

    const guestIndex = event.queues.indexOf(guestId);

    if (guestIndex === -1) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Guest not found in event")
      );
    }

    event.queues.splice(guestIndex, 1);

    if (event.currentPosition > event.queues.length - 1) {
      if (event.queues.length > 1) {
        event.currentPosition = event.queues.length - 1;
      } else {
        event.currentPosition = 0;
      }
    }

    await Promise.all([event.save(), queue.deleteOne()]);

    return res.json(createResponse(true, "Guest removed from queue"));
  } catch (e) {
    next(e);
  }
}
