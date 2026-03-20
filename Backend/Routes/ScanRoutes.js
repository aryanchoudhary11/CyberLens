import express from "express";
import {
  startScan,
  getScanById,
  getAllScans,
  deleteScan,
} from "../Controllers/scanController.js";

const router = express.Router();

router.post("/start", startScan);
router.get("/history", getAllScans);
router.get("/:id", getScanById);
router.delete("/:id", deleteScan);

export default router;
