export const extractCVEId = (vuln) => {
  // Check tags array for CVE pattern
  if (vuln.tags && Array.isArray(vuln.tags)) {
    const cveTag = vuln.tags.find((tag) => /^CVE-\d{4}-\d+$/i.test(tag));
    if (cveTag) return cveTag.toUpperCase();
  }

  // Check templateId
  if (vuln.templateId && /^CVE-\d{4}-\d+$/i.test(vuln.templateId)) {
    return vuln.templateId.toUpperCase();
  }

  // Check reference URLs for CVE IDs
  if (vuln.reference && Array.isArray(vuln.reference)) {
    for (const ref of vuln.reference) {
      const match = ref.match(/CVE-\d{4}-\d+/i);
      if (match) return match[0].toUpperCase();
    }
  }

  // Check name
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
      signal: AbortSignal.timeout(8000), // 8 second timeout
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data || !data.id) return null;

    return {
      cveId: data.id,
      cvssScore: data.cvss || data["cvss-score"] || null,
      description: data.summary || null,
      references: data.references || [],
      publishedDate: data.Published || null,
      lastModified: data.Modified || null,
      cwe: data.cwe || null,
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
    // Only override description if CVE has a better one
    description: vuln.description || cveData.description,
    // Merge references
    reference: [
      ...new Set([
        ...(vuln.reference || []),
        ...cveData.references.slice(0, 3), // max 3 extra refs
      ]),
    ],
  };
};
