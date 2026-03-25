import { exec } from "child_process";

export const runSSLyzeScan = (target) => {
  return new Promise((resolve, reject) => {
    const domain = target
      .replace("http://", "")
      .replace("https://", "")
      .split("/")[0];

    const command = `python3 -m sslyze ${domain} --json_out /tmp/sslyze-out.json`;

    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      exec("cat /tmp/sslyze-out.json", (err2, out2) => {
        if (err2) {
          resolve("");
          return;
        }
        resolve(out2 || "");
      });
    });
  });
};

export const parseSSLyzeOutput = (data) => {
  if (!data) return { grade: "N/A", issues: [] };
  try {
    const json = JSON.parse(data);
    const result = json?.server_scan_results?.[0];
    const issues = [];

    const tlsResult = result?.scan_result?.tls_1_0_cipher_suites;
    if (tlsResult?.result?.accepted_cipher_suites?.length > 0) {
      issues.push("TLS 1.0 supported (deprecated)");
    }

    const certInfo =
      result?.scan_result?.certificate_info?.result
        ?.certificate_deployments?.[0];
    const expiry =
      certInfo?.verified_certificate_chain?.[0]?.not_valid_after_utc;
    const issuer =
      certInfo?.verified_certificate_chain?.[0]?.issuer?.rfc4514_string;

    return {
      grade: issues.length === 0 ? "A" : issues.length < 3 ? "B" : "C",
      protocol: "TLS",
      issuer: issuer || "Unknown",
      expiry: expiry ? new Date(expiry) : null,
      issues,
    };
  } catch {
    return { grade: "N/A", issues: [] };
  }
};
