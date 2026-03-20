export const extractCVEId = (vuln) => {
  if (vuln.tags && Array.isArray(vuln.tags)) {
    const cveTag = vuln.tags.find((tag) => /^CVE-\d{4}-\d+$/i.test(tag));
    if (cveTag) return cveTag.toUpperCase();
  }

  if (vuln.templateId && /^CVE-\d{4}-\d+$/i.test(vuln.templateId)) {
    return vuln.templateId.toUpperCase();
  }

  if (vuln.reference && Array.isArray(vuln.reference)) {
    for (const ref of vuln.reference) {
      const match = ref.match(/CVE-\d{4}-\d+/i);
      if (match) return match[0].toUpperCase();
    }
  }

  if (vuln.name) {
    const match = vuln.name.match(/CVE-\d{4}-\d+/i);
    if (match) return match[0].toUpperCase();
  }

  return null;
};

export const fetchCVEDetails = async (cveId) => {
  if (!cveId) return null;

  try {
    const response = await fetch(`https://cve.circl.lu/api/cve/${cveId}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data || !data.id) return null;

    return {
      cveId: data.id,
      cvssScore: data.cvss || data["cvss-score"] || null,
      description: data.summary || null,
      references: data.references || [],
    };
  } catch (err) {
    console.error(`CVE lookup failed for ${cveId}:`, err.message);
    return null;
  }
};

export const enrichVulnWithCVE = async (vuln) => {
  const cveId = extractCVEId(vuln);
  if (!cveId) return vuln;

  const cveData = await fetchCVEDetails(cveId);
  if (!cveData) return { ...vuln, cveId };

  return {
    ...vuln,
    cveId: cveData.cveId,
    cvssScore: cveData.cvssScore,
    description: vuln.description || cveData.description,
    reference: [
      ...new Set([
        ...(vuln.reference || []),
        ...cveData.references.slice(0, 3),
      ]),
    ],
  };
};
