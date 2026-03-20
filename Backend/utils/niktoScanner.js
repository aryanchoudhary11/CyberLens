import { exec } from "child_process";
import { enrichVulnWithCVE } from "./cveLookup.js";

export const runNiktoScan = (target) => {
  return new Promise((resolve, reject) => {
    if (!target.startsWith("http")) {
      target = `http://${target}`;
    }

    const url = new URL(target);
    const host = url.hostname;
    const port = url.port || "80";

    const command = `nikto -h ${host} -port ${port} -nossl -maxtime 120 -nointeractive`;

    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error && !stdout) {
        console.error("Nikto error:", stderr);
        reject(error);
        return;
      }
      resolve(stdout || "");
    });
  });
};

export const parseNiktoOutput = async (data) => {
  if (!data) return [];

  const skipPatterns = [
    "Target IP",
    "Target Hostname",
    "Target Port",
    "Platform:",
    "Start Time",
    "End Time",
    "host(s) tested",
    "No CGI Directories",
    "CGI tests skipped",
    "Scan terminated",
    "Nikto v",
    "------",
  ];

  const results = data
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed.startsWith("+")) return false;
      if (skipPatterns.some((p) => trimmed.includes(p))) return false;
      return true;
    })
    .map((line) => {
      const clean = line.replace("+ ", "").trim();

      const idMatch = clean.match(/^\[(\w+)\]/);
      const templateId = idMatch ? idMatch[1] : "";

      const urlMatch = clean.match(/\s(\/[^\s:]+):/);
      const url = urlMatch ? `http://target${urlMatch[1]}` : "";

      const refMatch = clean.match(/See:\s+(https?:\/\/\S+)/);
      const reference = refMatch ? [refMatch[1]] : [];

      let severity = "medium";
      if (templateId) {
        const id = parseInt(templateId);
        if (id >= 600000) severity = "high";
        if (clean.toLowerCase().includes("xss")) severity = "high";
        if (clean.toLowerCase().includes("sql")) severity = "high";
        if (clean.toLowerCase().includes("rce")) severity = "critical";
        if (clean.toLowerCase().includes("missing")) severity = "low";
        if (clean.toLowerCase().includes("suggested")) severity = "low";
      }

      return {
        templateId,
        name: clean
          .replace(/\[.*?\]\s*/, "")
          .split(". See:")[0]
          .trim(),
        severity,
        description: clean,
        url,
        reference,
        tags: ["nikto", "web"],
        tool: "nikto",
      };
    })
    .filter((v) => v.name.length > 0);

  // Enrich with CVE data in parallel
  const enriched = await Promise.all(
    results.map((vuln) => enrichVulnWithCVE(vuln)),
  );

  return enriched;
};
