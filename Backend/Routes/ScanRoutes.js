import express from "express";
import { startScan } from "../Controllers/scanController.js";

const router = express.Router();

router.post("/start", startScan);

export default router;
