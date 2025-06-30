import mongoose from "mongoose";
import Queue from "../models/Queue.js";

export default async function getAnalytics(event) {
  const totalQueues = await Queue.countDocuments({
    event: new mongoose.Types.ObjectId(event._id),
  });

  const servedQueues = await Queue.countDocuments({
    served: true,
    event: new mongoose.Types.ObjectId(event._id),
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
    ...event,
    totalQueues,
    servedQueues,
    averageQueueTime: averageQueueTime[0]?.averageQueueTime || 0,
  };
}
