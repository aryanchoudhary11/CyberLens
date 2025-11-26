import ping from "ping";
import Target from "../models/Target.js";
import fetch from "node-fetch";

export const verifyTarget = async (req, res) => {
  try {
    const { id } = req.params;
    const target = await Target.findById(id);

    if (!target) return res.status(404).json({ error: "Target not found" });

    const ip = target.ip;

    const pingResult = await ping.promise.probe(ip);

    if (!pingResult.alive) {
      return res.json({ message: "Target unreachable", status: "unverified" });
    }

    let webStatus = false;

    try {
      const response = await fetch(`http://${ip}`, { method: "GET" });
      webStatus = response.ok;
    } catch (err) {}

    target.status = "verified";
    await target.save();

    res.json({
      message: "Target verified successfully",
      status: target.status,
      webStatus,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error verifying target" });
  }
};
