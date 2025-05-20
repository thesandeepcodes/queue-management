import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    queues: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Queue",
      },
    ],
    currentPosition: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
