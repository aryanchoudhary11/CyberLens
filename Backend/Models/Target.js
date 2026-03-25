import mongoose from "mongoose";

const targetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    ip: { type: String, required: true },
    type: { type: String, enum: ["web", "server", "network"], default: "web" },
    addedBy: { type: String },
    status: {
      type: String,
      enum: ["verified", "unverified"],
      default: "unverified",
    },
    riskScore: { type: Number, default: 0 },
    riskLevel: {
      type: String,
      enum: ["none", "low", "medium", "high", "critical"],
      default: "none",
    },
    lastScanned: { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.model("Target", targetSchema);
