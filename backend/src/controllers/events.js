import mongoose from "mongoose";
import Event from "../models/Event.js";
import Queue from "../models/Queue.js";
import createResponse from "../lib/Response.js";
import HTTP from "../lib/HTTP.js";
import AppError from "../errors/AppError.js";

import {
  eventCreationSchema,
  eventUpdateSchema,
} from "../schemas/eventSchema.js";

export async function createEvent(req, res, next) {
  try {
    const { userId } = req.user;

    const parsed = eventCreationSchema.safeParse(req.body);
    if (!parsed.success) throw parsed.error;

    const event = await Event.create({ ...parsed.data, createdBy: userId });

    return res.status(201).json(
      createResponse(true, "Event created successfully", {
        _id: event._id,
        name: event.name,
        description: event.description,
        maxAttendees: event.maxAttendees,
        eventDate: event.eventDate,
        createdBy: event.createdBy,
        completed: event.completed,
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function getEvent(req, res, next) {
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

    return res.json(createResponse(true, "Event fetched successfully", event));
  } catch (e) {
    next(e);
  }
}

export async function getEvents(req, res, next) {
  try {
    const { userId } = req.user;
    const events = await Event.find({ createdBy: userId });

    return res.json(
      createResponse(true, "Events fetched successfully", events)
    );
  } catch (e) {
    next(e);
  }
}

export async function updateEvent(req, res, next) {
  try {
    const { eventId } = req.params;

    if (!mongoose.isValidObjectId(eventId)) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Invalid event ID")
      );
    }

    const parsed = eventUpdateSchema.safeParse(req.body);
    if (!parsed.success) throw parsed.error;

    const updateData = parsed.data;

    if (Object.keys(updateData).length === 0) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(
          false,
          "No fields to update. Allowed fields: name, description, currentPosition"
        )
      );
    }

    const event = await Event.findByIdAndUpdate(eventId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      throw new AppError(
        HTTP.NOT_FOUND,
        createResponse(false, "Event not found")
      );
    }

    return res.json(
      createResponse(true, "Event updated successfully", {
        _id: event._id,
        name: event.name,
        description: event.description,
        maxAttendees: event.maxAttendees,
        eventDate: event.eventDate,
        currentPosition: event.currentPosition,
        additionalInfo: event.additionalInfo,
        completed: event.completed,
      })
    );
  } catch (e) {
    next(e);
  }
}

export async function deleteEvent(req, res, next) {
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

    if (Array.isArray(event.queues) && event.queues.length > 0) {
      await Queue.deleteMany({ _id: { $in: event.queues } });
    }

    await event.deleteOne();

    return res.json(
      createResponse(true, "Event deleted successfully", {
        _id: event._id,
        name: event.name,
        description: event.description,
      })
    );
  } catch (e) {
    next(e);
  }
}
