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
          .filter((it) => !it.served)
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

    const { guestId, newPosition } = result.data;

    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError(
        HTTP.NOT_FOUND,
        createResponse(false, "Event not found")
      );
    }

    if (event.queues.indexOf(guestId) === -1) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Guest not found in event")
      );
    }

    if (newPosition < event.currentPosition) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(
          false,
          "New position must be greater than current position of the event"
        )
      );
    }

    event.queues.splice(event.queues.indexOf(guestId), 1);
    event.queues.splice(newPosition, 0, guestId);
    await event.save();

    return res.json(createResponse(true, "Guest moved in queue"));
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

    event.queues.splice(guestIndex, 1);
    queue.served = true;
    queue.queueTime = Date.now() - queue.joinedAt.getTime();

    await Promise.all([event.save(), queue.save()]);

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

    await Promise.all([event.save(), queue.deleteOne()]);

    return res.json(createResponse(true, "Guest removed from queue"));
  } catch (e) {
    next(e);
  }
}
