import express from "express";
import Target from "../Models/Target.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, ip, type, addedBy } = req.body;
    const newTarget = await Target.create({ name, ip, type, addedBy });
    res.status(201).json(newTarget);
  } catch (err) {
    res.status(500).json({ message: "Failed to add target" });
  }
});

router.get("/", async (req, res) => {
  try {
    const targets = await Target.find();
    res.json(targets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch targets" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Target.findByIdAndDelete(req.params.id);
    res.json({ message: "Target deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete target" });
  }
});

export default router;
