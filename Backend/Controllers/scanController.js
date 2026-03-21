import { execFile } from "child_process";
import Scan from "../Models/Scan.js";
import Target from "../Models/Target.js";
import validator from "validator";
import { runNucleiScan } from "../utils/nucleiScanner.js";
import { parseNucleiOutput } from "../utils/parseNuclei.js";
import { runNiktoScan, parseNiktoOutput } from "../utils/niktoScanner.js";
import { runWhatWebScan, parseWhatWebOutput } from "../utils/whatwebScanner.js";
import {
  runSubfinderScan,
  parseSubfinderOutput,
} from "../utils/subfinderScanner.js";
import { runSSLyzeScan, parseSSLyzeOutput } from "../utils/sslyzeScanner.js";
import Vulnerability from "../Models/Vulnerability.js";

const nmapModes = {
  fast: ["-F"],
  service: ["-sV"],
  full: ["-sV", "-O", "-p-"],
};

const SUPPORTED_TOOLS = [
  "nmap",
  "nuclei",
  "nikto",
  "whatweb",
  "subfinder",
  "sslyze",
];

export const startScan = async (req, res) => {
  try {
    const { targetId, tool, options } = req.body;
    const userId = req.user.id;

    if (!targetId || !tool) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Only find target belonging to this user
    const targetDoc = await Target.findOne({ _id: targetId, userId });
    if (!targetDoc) {
      return res.status(404).json({ message: "Target not found" });
    }

    const target = targetDoc.url || targetDoc.ip;

    const isWebTool = ["nuclei", "nikto", "whatweb", "sslyze"].includes(tool);
    const cleanTarget = target
      .replace("http://", "")
      .replace("https://", "")
      .split("/")[0];

    if (
      !isWebTool &&
      !validator.isIP(cleanTarget) &&
      !validator.isFQDN(cleanTarget)
    ) {
      return res.status(400).json({ message: "Invalid target format" });
    }

    if (!SUPPORTED_TOOLS.includes(tool)) {
      return res.status(400).json({ message: "Tool not supported yet" });
    }

    // Create scan with userId
    const scan = await Scan.create({
      userId,
      targetId,
      target,
      scanTool: tool,
      scanMode: options?.mode || null,
      status: "running",
    });

    res.status(200).json({
      message: "Scan started",
      scanId: scan._id,
    });

    // --------------------------
    // NMAP SCAN
    // --------------------------
    if (tool === "nmap") {
      const mode = options?.mode || "fast";
      const nmapArgs = nmapModes[mode];

      if (!nmapArgs) {
        await Scan.findByIdAndUpdate(scan._id, { status: "failed" });
        return;
      }

      execFile("nmap", [...nmapArgs, cleanTarget], async (error, stdout) => {
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
          console.error("Nmap parse error:", err);
          await Scan.findByIdAndUpdate(scan._id, { status: "failed" });
        }
      });
    }

    // --------------------------
    // NUCLEI SCAN
    // --------------------------
    if (tool === "nuclei") {
      try {
        const nucleiRaw = await runNucleiScan(target);
        const parsed = await parseNucleiOutput(nucleiRaw);

        if (parsed.length > 0) {
          await Vulnerability.insertMany(
            parsed.map((v) => ({
              ...v,
              scanId: scan._id,
              userId,
              target,
              tool: "nuclei",
            })),
          );
        }

        await Scan.findByIdAndUpdate(scan._id, {
          rawOutput: nucleiRaw,
          status: "completed",
        });
      } catch (error) {
        console.error("Nuclei scan failed:", error);
        await Scan.findByIdAndUpdate(scan._id, { status: "failed" });
      }
    }

    // --------------------------
    // NIKTO SCAN
    // --------------------------
    if (tool === "nikto") {
      try {
        const raw = await runNiktoScan(target);
        const parsed = await parseNiktoOutput(raw);

        if (parsed.length > 0) {
          await Vulnerability.insertMany(
            parsed.map((v) => ({
              ...v,
              scanId: scan._id,
              userId,
              target,
              tool: "nikto",
            })),
          );
        }

        await Scan.findByIdAndUpdate(scan._id, {
          rawOutput: raw,
          status: "completed",
        });
      } catch (error) {
        console.error("Nikto scan failed:", error);
        await Scan.findByIdAndUpdate(scan._id, { status: "failed" });
      }
    }

    // --------------------------
    // WHATWEB SCAN
    // --------------------------
    if (tool === "whatweb") {
      try {
        const raw = await runWhatWebScan(target);
        const technologies = parseWhatWebOutput(raw);

        await Scan.findByIdAndUpdate(scan._id, {
          technologies,
          rawOutput: raw,
          status: "completed",
        });
      } catch (error) {
        console.error("WhatWeb scan failed:", error);
        await Scan.findByIdAndUpdate(scan._id, { status: "failed" });
      }
    }

    // --------------------------
    // SUBFINDER SCAN
    // --------------------------
    if (tool === "subfinder") {
      try {
        const raw = await runSubfinderScan(target);
        const subdomains = parseSubfinderOutput(raw);

        await Scan.findByIdAndUpdate(scan._id, {
          subdomains,
          rawOutput: raw,
          status: "completed",
        });
      } catch (error) {
        console.error("Subfinder scan failed:", error);
        await Scan.findByIdAndUpdate(scan._id, { status: "failed" });
      }
    }

    // --------------------------
    // SSLYZE SCAN
    // --------------------------
    if (tool === "sslyze") {
      try {
        const raw = await runSSLyzeScan(target);
        const sslInfo = parseSSLyzeOutput(raw);

        await Scan.findByIdAndUpdate(scan._id, {
          sslInfo,
          rawOutput: raw,
          status: "completed",
        });
      } catch (error) {
        console.error("SSLyze scan failed:", error);
        await Scan.findByIdAndUpdate(scan._id, { status: "failed" });
      }
    }
  } catch (error) {
    console.error("startScan error:", error);
    res.status(500).json({ message: "Scan failed" });
  }
};

export const getScanById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid scan ID" });
    }

    const scan = await Scan.findOne({ _id: id, userId });
    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }

    const vulnerabilities = await Vulnerability.find({ scanId: id });

    res.status(200).json({
      ...scan.toObject(),
      vulnerabilities,
    });
  } catch (error) {
    console.error("getScanById error:", error);
    res.status(500).json({ message: "Failed to fetch scan" });
  }
};

export const getAllScans = async (req, res) => {
  try {
    const scans = await Scan.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select("_id target scanTool scanMode status createdAt");

    res.status(200).json(scans);
  } catch (error) {
    console.error("getAllScans error:", error);
    res.status(500).json({ message: "Failed to fetch scans" });
  }
};

export const deleteScan = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid scan ID" });
    }

    const scan = await Scan.findOneAndDelete({ _id: id, userId });
    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }

    await Vulnerability.deleteMany({ scanId: id });

    res.status(200).json({ message: "Scan deleted successfully" });
  } catch (error) {
    console.error("deleteScan error:", error);
    res.status(500).json({ message: "Failed to delete scan" });
  }
};
