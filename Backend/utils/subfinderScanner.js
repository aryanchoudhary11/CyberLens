import { exec } from "child_process";

export const runSubfinderScan = (target) => {
  return new Promise((resolve) => {
    const domain = target
      .replace("http://", "")
      .replace("https://", "")
      .split("/")[0];

    // Skip if IP
    const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(domain);
    if (isIP) {
      console.log("Subfinder skipped — target is an IP");
      resolve("");
      return;
    }

    const command = `timeout 90s subfinder -d ${domain} -silent -timeout 20 -max-time 80`;

    exec(
      command,
      {
        maxBuffer: 1024 * 1024 * 50,
        timeout: 100000,
      },
      (error, stdout) => {
        if (stdout && stdout.length > 0) {
          resolve(stdout);
        } else {
          console.log("Subfinder returned no results");
          resolve("");
        }
      },
    );
  });
};

export const parseSubfinderOutput = (data) => {
  if (!data) return [];
  return data
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 300);
};
