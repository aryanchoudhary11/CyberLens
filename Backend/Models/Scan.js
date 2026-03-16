import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Target",
      required: true,
    },

    target: {
      type: String,
      required: true,
    },

    // Which tool is used
    scanTool: {
      type: String,
      enum: ["nmap", "nuclei"],
      required: true,
    },

    // Scan mode (only for nmap)
    scanMode: {
      type: String,
      enum: ["fast", "service", "full"],
      default: null,
    },

    openPorts: [
      {
        port: Number,
        service: String,
        version: String,
      },
    ],

    rawOutput: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Scan", scanSchema);
