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
    scanTool: {
      type: String,
      enum: ["nmap", "nuclei", "nikto", "whatweb", "subfinder", "sslyze"],
      required: true,
    },
    scanMode: {
      type: String,
      enum: ["fast", "service", "full"],
      default: null,
    },

    // Nmap results
    openPorts: [
      {
        port: Number,
        service: String,
        version: String,
      },
    ],

    // WhatWeb results
    technologies: [
      {
        name: String,
        version: String,
        category: String,
      },
    ],

    // Subfinder results
    subdomains: [String],

    // SSLyze results
    sslInfo: {
      grade: String,
      protocol: String,
      issuer: String,
      expiry: Date,
      issues: [String],
    },

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
