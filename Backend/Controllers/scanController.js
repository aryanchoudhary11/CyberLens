import { execFile } from "child_process";
import Scan from "../Models/Scan.js";
import Target from "../Models/Target.js";
import validator from "validator";
import { runNucleiScan } from "../utils/nucleiScanner.js";
import { parseNucleiOutput } from "../utils/parseNuclei.js";
import Vulnerability from "../Models/Vulnerability.js";

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

    const target = targetDoc.url || targetDoc.ip;

    if (!validator.isIP(target) && !validator.isFQDN(target)) {
      return res.status(400).json({ message: "Invalid target format" });
    }

    if (!["nmap", "nuclei"].includes(tool)) {
      return res.status(400).json({ message: "Tool not supported yet" });
    }

    // Create scan record
    const scan = await Scan.create({
      targetId,
      target,
      scanTool: tool,
      scanMode: options?.mode || null,
      status: "running",
    });

    // Send response immediately
    res.status(200).json({
      message: "Scan started",
      scanId: scan._id,
    });

    // --------------------------
    // NMAP SCAN (Background)
    // --------------------------

    if (tool === "nmap") {
      const mode = options?.mode || "fast";
      const nmapArgs = nmapModes[mode];

      if (!nmapArgs) {
        await Scan.findByIdAndUpdate(scan._id, { status: "failed" });
        return;
      }

      execFile("nmap", [...nmapArgs, target], async (error, stdout) => {
        try {
          if (error) {
            await Scan.findByIdAndUpdate(scan._id, { status: "failed" });
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
        } catch (err) {
          console.error(err);
          await Scan.findByIdAndUpdate(scan._id, { status: "failed" });
        }
      });
    }

    // --------------------------
    // NUCLEI SCAN (Background)
    // --------------------------

    if (tool === "nuclei") {
      try {
        const nucleiRaw = await runNucleiScan(target);

        const parsed = parseNucleiOutput(nucleiRaw);

        if (parsed.length > 0) {
          await Vulnerability.insertMany(
            parsed.map((v) => ({
              ...v,
              scanId: scan._id,
              target,
            })),
          );
        }

        await Scan.findByIdAndUpdate(scan._id, {
          rawOutput: nucleiRaw,
          status: "completed",
        });
      } catch (error) {
        console.error("Nuclei scan failed:", error);

        await Scan.findByIdAndUpdate(scan._id, {
          status: "failed",
        });
      }
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Scan failed",
    });
  }
};

export const getScanById = async (req, res) => {
  try {
    const { id } = req.params;

    const scan = await Scan.findById(id);

    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }

    const vulnerabilities = await Vulnerability.find({ scanId: id });

    res.status(200).json({
      ...scan.toObject(),
      vulnerabilities,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to fetch scan" });
  }
};

export const getAllScans = async (req, res) => {
  try {
    const scans = await Scan.find()
      .sort({ createdAt: -1 })
      .select("_id target scanTool scanMode status createdAt");

    res.status(200).json(scans);
  } catch (error) {
    console.error("Error fetching scans:", error);

    res.status(500).json({ message: "Failed to fetch scans" });
  }
};
