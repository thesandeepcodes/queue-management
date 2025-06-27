import mongoose from "mongoose";
import Notification from "../../models/Notification.js";

export default function watchNotification(socket) {
  const { eventId } = socket.handshake.query;

  if (!mongoose.isValidObjectId(eventId)) {
    socket.emit("notification:error", "Invalid event ID");
    return;
  }

  const pipeline = [
    {
      $match: {
        operationType: { $in: ["insert", "update", "delete", "replace"] },
      },
    },
  ];

  const cs = Notification.watch(pipeline, { fullDocument: "updateLookup" });

  cs.on("change", (change) => {
    const doc = change.fullDocument;

    const docEventId = doc?.event?.toString();

    if (change.operationType === "insert" && docEventId === eventId) {
      socket.emit("notification:added", doc);
    } else if (change.operationType === "update" && docEventId === eventId) {
      socket.emit("notification:updated", doc);
    } else if (change.operationType === "replace" && docEventId === eventId) {
      socket.emit("notification:updated", doc);
    } else if (change.operationType === "delete") {
      socket.emit("notification:deleted", { _id: change.documentKey._id });
    }
  });

  cs.on("error", (error) => socket.emit("notification:error", error));

  socket.on("disconnect", () => cs.close());
}
