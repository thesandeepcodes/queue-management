import mongoose from "mongoose";
import Event from "../models/Event.js";
import Queue from "../models/Queue.js";
import createResponse from "../lib/Response.js";
import HTTP from "../lib/HTTP.js";
import AppError from "../errors/AppError.js";

async function computeEventAnalytics(eventId) {
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

  const totalQueues = await Queue.countDocuments({
    event: new mongoose.Types.ObjectId(event._id),
  });

  const servedQueues = await Queue.countDocuments({
    _id: { $in: event.queues },
    served: true,
  });

  const averageQueueTime = await Queue.aggregate([
    {
      $match: {
        event: new mongoose.Types.ObjectId(event._id),
        served: true,
      },
    },
    {
      $group: {
        _id: null,
        averageQueueTime: { $avg: "$queueTime" },
      },
    },
  ]);

  return {
    ...event.toObject(),
    totalQueues,
    servedQueues,
    averageQueueTime: averageQueueTime[0]?.averageQueueTime || 0,
  };
}

export async function getEventAnalytics(req, res, next) {
  try {
    const analytics = await computeEventAnalytics(req.params?.eventId);

    return res.json(
      createResponse(true, "Event analytics fetched successfully", analytics)
    );
  } catch (e) {
    next(e);
  }
}

export async function getEventsAnalytics(req, res, next) {
  try {
    const { userId } = req.user;

    if (!mongoose.isValidObjectId(userId)) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Invalid user ID")
      );
    }

    const analytics = await Event.find({ createdBy: userId });

    const eventsAnalytics = await Promise.all(
      analytics.map(async (event) => await computeEventAnalytics(event._id))
    );

    return res.json(
      createResponse(
        true,
        "Events analytics fetched successfully",
        eventsAnalytics
      )
    );
  } catch (e) {
    next(e);
  }
}
