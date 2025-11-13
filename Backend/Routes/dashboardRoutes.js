import express from "express";
const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const dashboardData = {
      totalTargets: 1234,
      verifiedAssets: 1120,
      lastScanDate: "2025-11-10T14:30:00",
      criticalVulns: 87,
      vulnerabilities: {
        critical: 87,
        high: 234,
        medium: 561,
        low: 660,
      },
      byTarget: [
        { name: "WebApp-Prod", critical: 10, high: 20, medium: 30, low: 40 },
        { name: "DB-Server-01", critical: 15, high: 10, medium: 5, low: 0 },
        { name: "API-Gateway", critical: 7, high: 8, medium: 12, low: 6 },
        { name: "Internal-Tool", critical: 9, high: 12, medium: 8, low: 5 },
        { name: "Test-Server-03", critical: 2, high: 5, medium: 3, low: 1 },
      ],
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
