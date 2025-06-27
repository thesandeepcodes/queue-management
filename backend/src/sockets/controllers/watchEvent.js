import mongoose from "mongoose";
import Event from "../../models/Event.js";
import getAnalytics from "../../controllers/getAnalytics.js";

export default function watchEvent(socket) {
  const { eventId } = socket.handshake.query;

  if (!mongoose.isValidObjectId(eventId)) {
    socket.emit("event:error", "Invalid event ID");
    return;
  }

  const pipeline = [
    {
      $match: {
        operationType: { $in: ["update", "replace", "delete"] },
        "documentKey._id": new mongoose.Types.ObjectId(eventId),
      },
    },
  ];

  const cs = Event.watch(pipeline, { fullDocument: "updateLookup" });

  cs.on("change", async (change) => {
    if (change.operationType === "delete") {
      socket.emit("event:deleted", { _id: change.documentKey._id });
    } else {
      const event = change.fullDocument;
      const analytics = await getAnalytics(event);
      socket.emit("event:updated", analytics);
    }
  });

  socket.on("disconnect", () => cs.close());
}
