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
    eventDate: { type: Date, required: true },
    maxAttendees: { type: Number, required: true, default: 0 },
    completed: { type: Boolean, default: false },
    eventStartTime: { type: Date, default: Date.now },
    eventEndTime: { type: Date, default: Date.now },
    registrationTitle: { type: String, default: "" },
    registrationDescription: { type: String, default: "" },
    venue: {
      type: String,
      default: "",
    },
    queues: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Queue",
      },
    ],
    additionalInfo: [{ name: String, required: Boolean, _id: false }],
    currentPosition: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
