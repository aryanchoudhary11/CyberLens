import express from "express";
import Target from "../Models/Target.js";
import ping from "ping";

const router = express.Router();

// GET all targets for logged in user
router.get("/", async (req, res) => {
  try {
    const targets = await Target.find({ userId: req.user.id });
    res.json(targets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch targets" });
  }
});

// POST create target
router.post("/", async (req, res) => {
  try {
    const { name, ip, type, addedBy, status } = req.body;
    if (!name || !ip || !type) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newTarget = new Target({
      userId: req.user.id,
      name,
      ip,
      type,
      addedBy,
      status: status || "unverified",
    });
    await newTarget.save();
    res.status(201).json(newTarget);
  } catch (err) {
    res.status(500).json({ message: "Failed to add target" });
  }
});

// PUT update target
router.put("/:id", async (req, res) => {
  try {
    const updated = await Target.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true },
    );
    if (!updated) return res.status(404).json({ message: "Target not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update target" });
  }
});

// DELETE target
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Target.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Target not found" });
    res.json({ message: "Target deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete target" });
  }
});

// POST verify target
router.post("/:id/verify", async (req, res) => {
  try {
    const target = await Target.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!target) return res.status(404).json({ message: "Target not found" });

    const ipOrHost = target.ip;
    let pingAlive = false;
    try {
      const pingRes = await ping.promise.probe(ipOrHost, { timeout: 5 });
      pingAlive = !!pingRes.alive;
    } catch {
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
        });
        httpOk = response && response.status >= 200 && response.status < 400;
      } catch {
        httpOk = false;
      }
    }

    target.status = pingAlive || httpOk ? "verified" : target.status;
    await target.save();

    res.json({
      message: pingAlive || httpOk ? "Target verified" : "Target unreachable",
      status: target.status,
      checks: { pingAlive, httpOk },
      target,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error while verifying target" });
  }
});

export default router;
