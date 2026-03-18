import { exec } from "child_process";

export const runWhatWebScan = (target) => {
  return new Promise((resolve, reject) => {
    if (!target.startsWith("http")) {
      target = `http://${target}`;
    }

    const outFile = `/tmp/whatweb-${Date.now()}.json`;
    const command = `whatweb ${target} --log-json=${outFile} -a 3 --quiet`;

    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error) => {
      exec(`cat ${outFile}`, (err, out) => {
        exec(`rm -f ${outFile}`, () => {});
        if (err || !out) {
          resolve("");
          return;
        }
        resolve(out);
      });
    });
  });
};

export const parseWhatWebOutput = (data) => {
  if (!data) return [];

  try {
    const technologies = [];

    // WhatWeb wraps all entries in one big array
    // Parse the whole thing as one JSON array
    const cleaned = data.trim();
    const arr = JSON.parse(cleaned);

    for (const entry of arr) {
      if (!entry || !entry.plugins) continue;

      for (const [name, details] of Object.entries(entry.plugins)) {
        const exists = technologies.find((t) => t.name === name);
        if (!exists) {
          technologies.push({
            name,
            version: details?.version?.[0] || "",
            category: details?.string?.[0] || details?.os?.[0] || "",
          });
        }
      }
    }

    return technologies;
  } catch (e) {
    console.error("WhatWeb parse error:", e.message);
    return [];
  }
};
