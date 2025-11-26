import express from "express";
import Target from "../Models/Target.js";
import ping from "ping";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const targets = await Target.find();
    res.json(targets);
  } catch (err) {
    console.error("GET /targets error:", err);
    res.status(500).json({ message: "Failed to fetch targets" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, ip, type, addedBy, status } = req.body;

    if (!name || !ip || !type) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newTarget = new Target({
      name,
      ip,
      type,
      addedBy,
      status: status || "unverified",
    });
    await newTarget.save();

    res.status(201).json(newTarget);
  } catch (err) {
    console.error("POST /targets error:", err);
    res.status(500).json({ message: "Failed to add target" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Target.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "Target not found" });

    res.json(updated);
  } catch (err) {
    console.error("PUT /targets/:id error:", err);
    res.status(500).json({ message: "Failed to update target" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Target.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Target not found" });

    res.json({ message: "Target deleted successfully" });
  } catch (err) {
    console.error("DELETE /targets/:id error:", err);
    res.status(500).json({ message: "Failed to delete target" });
  }
});

router.post("/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const target = await Target.findById(id);
    if (!target) return res.status(404).json({ message: "Target not found" });

    const ipOrHost = target.ip;

    let pingAlive = false;
    try {
      const pingRes = await ping.promise.probe(ipOrHost, { timeout: 5 });
      pingAlive = !!pingRes.alive;
    } catch (pingErr) {
      console.warn("Ping error:", pingErr);
      pingAlive = false;
    }

    let httpOk = false;
    if (target.type === "web" || target.type === "api") {
      try {
        const url = ipOrHost.startsWith("http")
          ? ipOrHost
          : `http://${ipOrHost}`;
        const response = await fetch(url, {
          method: "GET",
          redirect: "follow",
          timeout: 5000,
        });
        httpOk = response && response.status >= 200 && response.status < 400;
      } catch (httpErr) {
        httpOk = false;
      }
    }
    const reachable = pingAlive || httpOk;

    if (reachable) {
      target.status = "verified";
    } else {
      target.status = target.status || "unverified";
    }

    await target.save();

    res.json({
      message: reachable ? "Target verified" : "Target unreachable",
      status: target.status,
      checks: { pingAlive, httpOk },
      target: target,
    });
  } catch (err) {
    console.error("POST /targets/:id/verify error:", err);
    res.status(500).json({ message: "Server error while verifying target" });
  }
});

export default router;
