import express from "express";
import Target from "../Models/Target.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const targets = await Target.find();
    res.json(targets);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
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
  } catch (error) {
    console.error("Error adding target:", error);
    res.status(500).json({ error: "Server error while adding target" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Target.findByIdAndDelete(req.params.id);
    res.json({ message: "Target deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting target" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedTarget = await Target.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedTarget) {
      return res.status(404).json({ error: "Target not found" });
    }

    res.json(updatedTarget);
  } catch (error) {
    res.status(500).json({ error: "Error updating target" });
  }
});

export default router;
