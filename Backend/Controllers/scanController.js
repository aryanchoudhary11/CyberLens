import { execFile } from "child_process";
import Scan from "../Models/Scan.js";
import Target from "../Models/Target.js";
import validator from "validator";

const nmapModes = {
  fast: ["-F"],
  service: ["-sV"],
  full: ["-sV", "-O", "-p-"],
};

export const startScan = async (req, res) => {
  try {
    const { targetId, tool, options } = req.body;

    if (!targetId || !tool) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const targetDoc = await Target.findById(targetId);
    if (!targetDoc) {
      return res.status(404).json({ message: "Target not found" });
    }

    const target = targetDoc.ip;

    if (!validator.isIP(target) && !validator.isFQDN(target)) {
      return res.status(400).json({ message: "Invalid target format" });
    }

    // Only Nmap supported currently
    if (tool !== "nmap") {
      return res.status(400).json({ message: "Tool not supported yet" });
    }

    const mode = options?.mode || "fast";
    const nmapArgs = nmapModes[mode];

    if (!nmapArgs) {
      return res.status(400).json({ message: "Invalid Nmap mode" });
    }

    const scan = await Scan.create({
      targetId,
      target,
      scanType: mode,
      status: "running",
    });

    execFile("nmap", [...nmapArgs, target], async (error, stdout, stderr) => {
      if (error) {
        await Scan.findByIdAndUpdate(scan._id, {
          status: "failed",
        });
        return;
      }

      const openPorts = stdout
        .split("\n")
        .filter((line) => line.includes("/tcp") && line.includes("open"))
        .map((line) => {
          const parts = line.trim().split(/\s+/);
          return {
            port: parseInt(parts[0]),
            service: parts[2],
            version: parts.slice(3).join(" ") || "",
          };
        });

      await Scan.findByIdAndUpdate(scan._id, {
        openPorts,
        rawOutput: stdout,
        status: "completed",
      });
    });

    res.status(200).json({
      message: "Scan started",
      scanId: scan._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Scan failed" });
  }
};
export const getScanById = async (req, res) => {
  try {
    const { id } = req.params;

    const scan = await Scan.findById(id);

    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }

    res.status(200).json(scan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch scan" });
  }
};
