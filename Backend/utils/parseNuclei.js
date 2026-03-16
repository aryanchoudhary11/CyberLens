export const parseNucleiOutput = (data) => {
  if (!data) return [];

  const lines = data.split("\n").filter((line) => line.trim() !== "");

  const results = [];

  for (const line of lines) {
    try {
      const json = JSON.parse(line);

      results.push({
        templateId: json["template-id"],
        severity: json.info?.severity || "unknown",
        name: json.info?.name || "",
        description: json.info?.description || "",
        host: json.host,
        url: json["matched-at"] || json.host, // exact vulnerable URL
        tags: json.info?.tags || [], // e.g. ["sqli", "cve"]
        reference: json.info?.reference || [], // CVE links etc
      });
    } catch (err) {
      continue;
    }
  }

  return results;
};
