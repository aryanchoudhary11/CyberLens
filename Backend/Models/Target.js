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
  },
  { timestamps: true },
);

export default mongoose.model("Target", targetSchema);
