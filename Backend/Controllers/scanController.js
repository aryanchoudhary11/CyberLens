import { execFile } from "child_process";
import Scan from "../Models/Scan.js";
import validator from "validator";
import { parseNmapOutput } from "../utils/nmapParser.js";

const scanCommands = {
  fast: ["-F"],
  service: ["-sV"],
  full: ["-sV", "-O", "-p-"],
};

export const startScan = async (req, res) => {
  try {
    const { target, scanType = "fast" } = req.body;

    if (!target) {
      return res.status(400).json({ message: "Target is required" });
    }

    if (!validator.isIP(target) && !validator.isFQDN(target)) {
      return res.status(400).json({ message: "Invalid target format" });
    }

    if (!scanCommands[scanType]) {
      return res.status(400).json({ message: "Invalid scan type" });
    }

    // Create scan entry
    const scan = await Scan.create({
      target,
      scanType,
      status: "running",
    });

    execFile(
      "nmap",
      [...scanCommands[scanType], target],
      async (error, stdout, stderr) => {
        if (error) {
          await Scan.findByIdAndUpdate(scan._id, {
            status: "failed",
          });
          return;
        }

        const openPorts = parseNmapOutput(stdout);

        await Scan.findByIdAndUpdate(scan._id, {
          openPorts,
          rawOutput: stdout,
          status: "completed",
        });
      },
    );

    res.status(200).json({
      message: "Scan started",
      scanId: scan._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Scan failed", error });
  }
};
