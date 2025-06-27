import mongoose from "mongoose";
import Queue from "../models/Queue.js";
import Event from "../models/Event.js";

import AppError from "../errors/AppError.js";
import HTTP from "../lib/HTTP.js";
import createResponse from "../lib/Response.js";

import { queueCreationSchema } from "../schemas/queueSchema.js";

export async function getQueue(req, res, next) {
  try {
    const { guestId } = req.params ?? {};

    if (!mongoose.isValidObjectId(guestId)) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Invalid guest ID")
      );
    }

    const queue = await Queue.findById(guestId);

    if (!queue) {
      throw new AppError(
        HTTP.NOT_FOUND,
        createResponse(false, "Guest not found")
      );
    }

    return res
      .status(200)
      .json(createResponse(true, "Guest found successfully", queue));
  } catch (e) {
    next(e);
  }
}

export async function joinQueue(req, res, next) {
  try {
    const { eventId } = req.params ?? {};

    if (!mongoose.isValidObjectId(eventId)) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Invalid event ID")
      );
    }

    const result = await queueCreationSchema.safeParseAsync(req.body);
    if (!result.success) throw result.error;

    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError(
        HTTP.NOT_FOUND,
        createResponse(false, "Event not found")
      );
    }

    if (event?.completed) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(
          false,
          "The event has already ended. No further guests can join. Please contact the administrator."
        )
      );
    }

    if (
      event?.maxAttendees === event?.queues.length &&
      event?.queues.length > 0
    ) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(
          false,
          "The event is full. No further guests can join. Please contact the administrator."
        )
      );
    }

    const queue = await Queue.create({
      ...result.data,
      event: event._id,
    });

    event.queues.push(queue._id);
    await event.save();

    return res.status(201).json(
      createResponse(true, "Guest joined successfully", {
        event: event.name,
        guestId: queue._id,
        position: event.queues.length,
      })
    );
  } catch (e) {
    next(e);
  }
}

export async function leaveQueue(req, res, next) {
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

    const queue = await Queue.findById(guestId);
    if (!queue) {
      throw new AppError(
        HTTP.NOT_FOUND,
        createResponse(false, "Guest not found")
      );
    }

    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError(
        HTTP.NOT_FOUND,
        createResponse(false, "Event not found")
      );
    }

    if (event?.completed) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(
          false,
          "The event has been completed. No further guests can leave. Please contact the administrator."
        )
      );
    }

    const isInQueue = event.queues.some((id) => id.equals(queue._id));
    if (!isInQueue) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Guest not in queue. Please join first.")
      );
    }

    event.queues = event.queues.filter((id) => !id.equals(queue._id));

    if (event.currentPosition > event.queues.length - 1) {
      if (event.queues.length > 1) {
        event.currentPosition = event.queues.length - 1;
      } else {
        event.currentPosition = 0;
      }
    }

    await event.save();

    await Queue.findByIdAndDelete(guestId);

    return res.status(200).json(
      createResponse(true, "Guest left successfully", {
        guestId: queue._id,
        name: queue.name,
        phone: queue.phone,
      })
    );
  } catch (e) {
    next(e);
  }
}
