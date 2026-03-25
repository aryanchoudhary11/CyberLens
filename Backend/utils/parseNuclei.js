import { enrichVulnWithCVE } from "./cveLookup.js";

export const parseNucleiOutput = async (data) => {
  if (!data) return [];

  const lines = data.split("\n").filter((line) => line.trim() !== "");
  const results = [];

  for (const line of lines) {
    try {
      const json = JSON.parse(line);

      // Extract CVSS score directly from nuclei output
      const cvssScore =
        json.info?.classification?.["cvss-score"] ||
        json.info?.metadata?.["cvss-score"] ||
        null;

      // Extract CVE ID directly from nuclei output
      const cveIds = json.info?.classification?.["cve-id"] || [];
      const cveId =
        Array.isArray(cveIds) && cveIds.length > 0 ? cveIds[0] : null;

      results.push({
        templateId: json["template-id"],
        severity: json.info?.severity || "unknown",
        name: json.info?.name || "",
        description: json.info?.description || "",
        host: json.host,
        url: json["matched-at"] || json.host,
        tags: json.info?.tags || [],
        reference: json.info?.reference || [],
        cvssScore,
        cveId,
      });
    } catch (err) {
      continue;
    }
  }

  const enriched = await Promise.all(
    results.map((vuln) => enrichVulnWithCVE(vuln)),
  );

  return enriched;
};
