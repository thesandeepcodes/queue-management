import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: String,
    email: String,
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    leftAt: Date,
    served: {
      type: Boolean,
      default: false,
    },
    queueTime: {
      type: Number,
      default: 0,
    },
    additionalInfo: {
      type: [
        {
          name: String,
          _id: false,
        },
      ],
      default: [],
    },
  },
  { versionKey: false }
);

const Queue = mongoose.model("Queue", queueSchema);
export default Queue;
