import mongoose from "mongoose";
import Queue from "../../models/Queue.js";

export default function watchQueues(socket) {
  const { eventId } = socket.handshake.query;

  if (!mongoose.isValidObjectId(eventId)) {
    socket.emit("queues:error", "Invalid event ID");
    return;
  }

  const pipeline = [
    {
      $match: {
        operationType: { $in: ["insert", "update", "delete", "replace"] },
      },
    },
  ];

  const cs = Queue.watch(pipeline, { fullDocument: "updateLookup" });

  cs.on("change", (change) => {
    const doc = change.fullDocument;

    const docEventId = doc?.event?.toString();

    if (change.operationType === "insert" && docEventId === eventId) {
      socket.emit("queues:added", doc);
    } else if (change.operationType === "update" && docEventId === eventId) {
      socket.emit("queues:updated", doc);
    } else if (change.operationType === "replace" && docEventId === eventId) {
      socket.emit("queues:updated", doc);
    } else if (change.operationType === "delete") {
      socket.emit("queues:deleted", { _id: change.documentKey._id });
    }
  });

  socket.on("disconnect", () => cs.close());
}
