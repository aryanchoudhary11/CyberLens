import Vulnerability from "../Models/Vulnerability.js";
import Target from "../Models/Target.js";
import mongoose from "mongoose";

export const calculateRiskScore = (counts) => {
  return (
    (counts.critical || 0) * 10 +
    (counts.high || 0) * 7 +
    (counts.medium || 0) * 4 +
    (counts.low || 0) * 1
  );
};

export const getRiskLevel = (score) => {
  if (score === 0) return "none";
  if (score <= 20) return "low";
  if (score <= 50) return "medium";
  if (score <= 100) return "high";
  return "critical";
};

export const updateTargetRisk = async (targetId, target, userId) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [critical, high, medium, low] = await Promise.all([
      Vulnerability.countDocuments({
        target,
        severity: "critical",
        userId: userObjectId,
      }),
      Vulnerability.countDocuments({
        target,
        severity: "high",
        userId: userObjectId,
      }),
      Vulnerability.countDocuments({
        target,
        severity: "medium",
        userId: userObjectId,
      }),
      Vulnerability.countDocuments({
        target,
        severity: "low",
        userId: userObjectId,
      }),
    ]);

    const score = calculateRiskScore({ critical, high, medium, low });
    const level = getRiskLevel(score);

    await Target.findByIdAndUpdate(targetId, {
      riskScore: score,
      riskLevel: level,
      lastScanned: new Date(),
    });

    console.log(
      `Risk updated for ${target}: score=${score} level=${level} (critical=${critical} high=${high} medium=${medium} low=${low})`,
    );
  } catch (err) {
    console.error("Risk scoring failed:", err.message);
  }
};
