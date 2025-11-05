import mongoose from "mongoose";

const targetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ip: { type: String, required: true },
  type: {
    type: String,
    enum: ["web", "server", "api", "other"],
    default: "web",
  },
  status: {
    type: String,
    enum: ["active", "scanned", "vulnerable"],
    default: "active",
  },
  addedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Target", targetSchema);
