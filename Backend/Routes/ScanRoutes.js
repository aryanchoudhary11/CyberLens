import express from "express";
import { startScan } from "../Controllers/scanController.js";
import { getScanById } from "../Controllers/scanController.js";

const router = express.Router();

router.post("/start", startScan);
router.get("/:id", getScanById);

export default router;
