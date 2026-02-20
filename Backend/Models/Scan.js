import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Target",
    },
    target: {
      type: String,
      required: true,
    },
    scanType: {
      type: String,
      enum: ["fast", "service", "full"],
      default: "fast",
    },
    openPorts: [
      {
        port: Number,
        service: String,
        version: String,
      },
    ],
    rawOutput: String,
    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Scan", scanSchema);
