import express from "express";
import Target from "../Models/Target.js";
import Scan from "../Models/Scan.js";
import Vulnerability from "../Models/Vulnerability.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    // --- Basic counts ---
    const totalTargets = await Target.countDocuments();
    const verifiedAssets = await Target.countDocuments({ status: "verified" });
    const totalScans = await Scan.countDocuments();

    // --- Last scan date ---
    const lastScan = await Scan.findOne()
      .sort({ createdAt: -1 })
      .select("createdAt");
    const lastScanDate = lastScan ? lastScan.createdAt : null;

    // --- Vulnerability severity counts ---
    const criticalVulns = await Vulnerability.countDocuments({
      severity: "critical",
    });
    const highVulns = await Vulnerability.countDocuments({ severity: "high" });
    const mediumVulns = await Vulnerability.countDocuments({
      severity: "medium",
    });
    const lowVulns = await Vulnerability.countDocuments({ severity: "low" });

    // --- Scans by tool ---
    const scansByTool = await Scan.aggregate([
      { $group: { _id: "$scanTool", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // --- Recent scans (last 5) ---
    const recentScans = await Scan.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("target scanTool status createdAt");

    // --- Vulnerabilities by target (top 5) ---
    const vulnsByTarget = await Vulnerability.aggregate([
      { $group: { _id: "$target", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // --- Scans per day (last 7 days) ---
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const scansPerDay = await Scan.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalTargets,
      verifiedAssets,
      totalScans,
      lastScanDate,
      criticalVulns,
      vulnerabilities: {
        critical: criticalVulns,
        high: highVulns,
        medium: mediumVulns,
        low: lowVulns,
      },
      scansByTool,
      recentScans,
      vulnsByTarget,
      scansPerDay,
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
