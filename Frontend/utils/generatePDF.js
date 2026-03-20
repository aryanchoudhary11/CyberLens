import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;

const severityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case "critical":
      return "#ef4444";
    case "high":
      return "#f97316";
    case "medium":
      return "#eab308";
    case "low":
      return "#3b82f6";
    default:
      return "#6b7280";
  }
};

export const generateScanPDF = (scan) => {
  const generatedAt = new Date().toLocaleString();
  const scanDate = new Date(scan.createdAt).toLocaleString();
  const finishedAt = scan.updatedAt
    ? new Date(scan.updatedAt).toLocaleString()
    : "N/A";

  const sections = [];

  // ---- NMAP ----
  if (scan.scanTool === "nmap") {
    sections.push({ text: "Open Ports", style: "sectionHeader" });
    sections.push({ text: " ", margin: [0, 0, 0, 6] });

    if (!scan.openPorts || scan.openPorts.length === 0) {
      sections.push({ text: "No open ports found.", style: "noData" });
    } else {
      sections.push({
        table: {
          headerRows: 1,
          widths: ["20%", "30%", "50%"],
          body: [
            [
              { text: "Port", style: "tableHeader" },
              { text: "Service", style: "tableHeader" },
              { text: "Version", style: "tableHeader" },
            ],
            ...scan.openPorts.map((port) => [
              { text: String(port.port), style: "tableCell" },
              { text: port.service || "-", style: "tableCell" },
              { text: port.version || "-", style: "tableCell" },
            ]),
          ],
        },
        layout: {
          fillColor: (rowIndex) =>
            rowIndex === 0
              ? "#e2e8f0"
              : rowIndex % 2 === 0
                ? "#f8fafc"
                : "#ffffff",
          hLineColor: () => "#cbd5e1",
          vLineColor: () => "#cbd5e1",
        },
        margin: [0, 0, 0, 20],
      });
    }
  }

  // ---- NUCLEI ----
  if (scan.scanTool === "nuclei") {
    sections.push({ text: "Vulnerabilities", style: "sectionHeader" });
    sections.push({ text: " ", margin: [0, 0, 0, 6] });

    if (!scan.vulnerabilities || scan.vulnerabilities.length === 0) {
      sections.push({ text: "No vulnerabilities detected.", style: "noData" });
    } else {
      scan.vulnerabilities.forEach((vuln) => {
        sections.push({
          table: {
            widths: ["*"],
            body: [
              [
                {
                  stack: [
                    {
                      columns: [
                        {
                          text: vuln.name || "Unknown",
                          style: "vulnName",
                          width: "*",
                        },
                        {
                          text: (vuln.severity || "unknown").toUpperCase(),
                          color: severityColor(vuln.severity),
                          bold: true,
                          fontSize: 9,
                          alignment: "right",
                          width: "auto",
                        },
                      ],
                    },
                    vuln.description
                      ? { text: vuln.description, style: "vulnDesc" }
                      : { text: "" },
                    vuln.url
                      ? { text: `URL: ${vuln.url}`, style: "vulnMeta" }
                      : { text: "" },
                    vuln.templateId
                      ? {
                          text: `Template: ${vuln.templateId}`,
                          style: "vulnMeta",
                        }
                      : { text: "" },
                  ],
                  margin: [8, 8, 8, 8],
                },
              ],
            ],
          },
          layout: {
            hLineColor: () => severityColor(vuln.severity),
            vLineColor: () => severityColor(vuln.severity),
            fillColor: () => "#f8fafc",
          },
          margin: [0, 0, 0, 8],
        });
      });
    }
  }

  // ---- NIKTO ----
  if (scan.scanTool === "nikto") {
    sections.push({ text: "Nikto Findings", style: "sectionHeader" });
    sections.push({ text: " ", margin: [0, 0, 0, 6] });

    if (!scan.vulnerabilities || scan.vulnerabilities.length === 0) {
      sections.push({ text: "No findings detected.", style: "noData" });
    } else {
      sections.push({
        table: {
          headerRows: 1,
          widths: ["60%", "20%", "20%"],
          body: [
            [
              { text: "Finding", style: "tableHeader" },
              { text: "Severity", style: "tableHeader" },
              { text: "ID", style: "tableHeader" },
            ],
            ...scan.vulnerabilities.map((vuln) => [
              { text: vuln.name || "-", style: "tableCell" },
              {
                text: (vuln.severity || "medium").toUpperCase(),
                color: severityColor(vuln.severity),
                bold: true,
                fontSize: 8,
              },
              { text: vuln.templateId || "-", style: "tableCell" },
            ]),
          ],
        },
        layout: {
          fillColor: (rowIndex) =>
            rowIndex === 0
              ? "#e2e8f0"
              : rowIndex % 2 === 0
                ? "#f8fafc"
                : "#ffffff",
          hLineColor: () => "#cbd5e1",
          vLineColor: () => "#cbd5e1",
        },
        margin: [0, 0, 0, 20],
      });
    }
  }

  // ---- WHATWEB ----
  if (scan.scanTool === "whatweb") {
    sections.push({ text: "Detected Technologies", style: "sectionHeader" });
    sections.push({ text: " ", margin: [0, 0, 0, 6] });

    if (!scan.technologies || scan.technologies.length === 0) {
      sections.push({ text: "No technologies detected.", style: "noData" });
    } else {
      sections.push({
        table: {
          headerRows: 1,
          widths: ["40%", "30%", "30%"],
          body: [
            [
              { text: "Technology", style: "tableHeader" },
              { text: "Version", style: "tableHeader" },
              { text: "Category", style: "tableHeader" },
            ],
            ...scan.technologies.map((tech) => [
              { text: tech.name || "-", style: "tableCell" },
              { text: tech.version || "-", style: "tableCell" },
              { text: tech.category || "-", style: "tableCell" },
            ]),
          ],
        },
        layout: {
          fillColor: (rowIndex) =>
            rowIndex === 0
              ? "#e2e8f0"
              : rowIndex % 2 === 0
                ? "#f8fafc"
                : "#ffffff",
          hLineColor: () => "#cbd5e1",
          vLineColor: () => "#cbd5e1",
        },
        margin: [0, 0, 0, 20],
      });
    }
  }

  // ---- SUBFINDER ----
  if (scan.scanTool === "subfinder") {
    sections.push({ text: "Subdomains Discovered", style: "sectionHeader" });
    sections.push({ text: " ", margin: [0, 0, 0, 6] });

    if (!scan.subdomains || scan.subdomains.length === 0) {
      sections.push({ text: "No subdomains found.", style: "noData" });
    } else {
      const half = Math.ceil(scan.subdomains.length / 2);
      const col1 = scan.subdomains.slice(0, half);
      const col2 = scan.subdomains.slice(half);

      sections.push({
        columns: [
          {
            ul: col1.map((s) => ({ text: s, style: "subdomainItem" })),
            width: "50%",
          },
          {
            ul: col2.map((s) => ({ text: s, style: "subdomainItem" })),
            width: "50%",
          },
        ],
        margin: [0, 0, 0, 20],
      });
    }
  }

  // ---- SSLYZE ----
  if (scan.scanTool === "sslyze") {
    sections.push({ text: "SSL/TLS Analysis", style: "sectionHeader" });
    sections.push({ text: " ", margin: [0, 0, 0, 6] });

    if (!scan.sslInfo || scan.sslInfo.grade === "N/A") {
      sections.push({
        text: "No SSL/TLS detected — target may be HTTP only.",
        style: "noData",
      });
    } else {
      sections.push({
        table: {
          widths: ["30%", "70%"],
          body: [
            [
              { text: "Grade", style: "tableHeader" },
              {
                text: scan.sslInfo.grade || "N/A",
                color:
                  scan.sslInfo.grade === "A"
                    ? "#16a34a"
                    : scan.sslInfo.grade === "B"
                      ? "#ca8a04"
                      : "#ea580c",
                bold: true,
                fontSize: 20,
              },
            ],
            [
              { text: "Protocol", style: "tableHeader" },
              { text: scan.sslInfo.protocol || "TLS", style: "tableCell" },
            ],
            [
              { text: "Issuer", style: "tableHeader" },
              { text: scan.sslInfo.issuer || "Unknown", style: "tableCell" },
            ],
            [
              { text: "Expiry", style: "tableHeader" },
              {
                text: scan.sslInfo.expiry
                  ? new Date(scan.sslInfo.expiry).toLocaleDateString()
                  : "N/A",
                style: "tableCell",
              },
            ],
            [
              { text: "Issues", style: "tableHeader" },
              {
                text:
                  scan.sslInfo.issues?.length > 0
                    ? scan.sslInfo.issues.join("\n")
                    : "No issues found",
                style: "tableCell",
                color: scan.sslInfo.issues?.length > 0 ? "#ef4444" : "#16a34a",
              },
            ],
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#f1f5f9" : "#ffffff"),
          hLineColor: () => "#cbd5e1",
          vLineColor: () => "#cbd5e1",
        },
        margin: [0, 0, 0, 20],
      });
    }
  }

  // ---- SEVERITY SUMMARY ----
  const hasVulns =
    ["nuclei", "nikto"].includes(scan.scanTool) &&
    scan.vulnerabilities?.length > 0;
  if (hasVulns) {
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    scan.vulnerabilities.forEach((v) => {
      const s = v.severity?.toLowerCase();
      if (counts[s] !== undefined) counts[s]++;
    });

    sections.unshift(
      { text: "Severity Summary", style: "sectionHeader" },
      { text: " ", margin: [0, 0, 0, 6] },
      {
        table: {
          widths: ["25%", "25%", "25%", "25%"],
          body: [
            [
              {
                text: `${counts.critical}\nCritical`,
                style: "severityBox",
                color: "#ef4444",
                fillColor: "#fef2f2",
              },
              {
                text: `${counts.high}\nHigh`,
                style: "severityBox",
                color: "#f97316",
                fillColor: "#fff7ed",
              },
              {
                text: `${counts.medium}\nMedium`,
                style: "severityBox",
                color: "#eab308",
                fillColor: "#fefce8",
              },
              {
                text: `${counts.low}\nLow`,
                style: "severityBox",
                color: "#3b82f6",
                fillColor: "#eff6ff",
              },
            ],
          ],
        },
        layout: {
          hLineColor: () => "#e2e8f0",
          vLineColor: () => "#e2e8f0",
        },
        margin: [0, 0, 0, 24],
      },
    );
  }

  // ---- DOCUMENT DEFINITION ----
  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 60, 40, 60],

    content: [
      // Header
      {
        table: {
          widths: ["*", "auto"],
          body: [
            [
              {
                stack: [
                  { text: "CyberLens", style: "brandName" },
                  {
                    text: "Vulnerability Assessment Report",
                    style: "reportTitle",
                  },
                ],
                margin: [8, 8, 0, 8],
              },
              {
                text: scan.scanTool?.toUpperCase(),
                style: "toolBadge",
                alignment: "right",
                margin: [0, 12, 8, 0],
              },
            ],
          ],
        },
        layout: {
          fillColor: () => "#1e3a5f",
          hLineColor: () => "#1e3a5f",
          vLineColor: () => "#1e3a5f",
        },
        margin: [0, 0, 0, 20],
      },

      // Scan Info Table
      {
        table: {
          widths: ["25%", "75%"],
          body: [
            [
              { text: "Target", style: "infoLabel" },
              { text: scan.target || "-", style: "infoValue" },
            ],
            [
              { text: "Tool", style: "infoLabel" },
              { text: scan.scanTool?.toUpperCase() || "-", style: "infoValue" },
            ],
            [
              { text: "Status", style: "infoLabel" },
              {
                text: scan.status?.toUpperCase() || "-",
                color: scan.status === "completed" ? "#16a34a" : "#dc2626",
                bold: true,
                fontSize: 10,
              },
            ],
            [
              { text: "Started", style: "infoLabel" },
              { text: scanDate, style: "infoValue" },
            ],
            [
              { text: "Finished", style: "infoLabel" },
              { text: finishedAt, style: "infoValue" },
            ],
            [
              { text: "Generated", style: "infoLabel" },
              { text: generatedAt, style: "infoValue" },
            ],
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#f1f5f9" : "#ffffff"),
          hLineColor: () => "#e2e8f0",
          vLineColor: () => "#e2e8f0",
        },
        margin: [0, 0, 0, 30],
      },

      // Main sections
      ...sections,

      // Footer
      {
        text: "Generated by CyberLens — Automated Vulnerability Assessment Platform",
        style: "footer",
        margin: [0, 20, 0, 0],
      },
    ],

    styles: {
      brandName: { fontSize: 20, bold: true, color: "#ffffff" },
      reportTitle: { fontSize: 10, color: "#93c5fd", margin: [0, 2, 0, 0] },
      toolBadge: { fontSize: 14, bold: true, color: "#67e8f9" },
      sectionHeader: {
        fontSize: 13,
        bold: true,
        color: "#1e293b",
        margin: [0, 16, 0, 4],
      },
      infoLabel: { fontSize: 9, bold: true, color: "#64748b" },
      infoValue: { fontSize: 9, color: "#1e293b" },
      tableHeader: { fontSize: 9, bold: true, color: "#475569" },
      tableCell: { fontSize: 9, color: "#334155" },
      vulnName: { fontSize: 10, bold: true, color: "#1e293b" },
      vulnDesc: { fontSize: 8, color: "#64748b", margin: [0, 3, 0, 0] },
      vulnMeta: { fontSize: 7, color: "#94a3b8", margin: [0, 2, 0, 0] },
      noData: {
        fontSize: 10,
        color: "#94a3b8",
        italics: true,
        margin: [0, 4, 0, 16],
      },
      subdomainItem: { fontSize: 8, color: "#334155" },
      severityBox: {
        fontSize: 16,
        bold: true,
        alignment: "center",
        margin: [0, 8, 0, 8],
      },
      footer: {
        fontSize: 8,
        color: "#94a3b8",
        alignment: "center",
        italics: true,
      },
    },

    defaultStyle: { font: "Roboto" },
  };

  pdfMake
    .createPdf(docDefinition)
    .download(`cyberlens-${scan.scanTool}-${scan.target}-${Date.now()}.pdf`);
};
