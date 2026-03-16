import { exec } from "child_process";

export const runNucleiScan = (target) => {
  return new Promise((resolve, reject) => {
    if (!target.startsWith("http")) {
      target = `http://${target}`;
    }

    const command = `nuclei -u ${target} -no-httpx -exclude-tags dos,blind,fuzz,time-based,network,ssl -severity low,medium,high,critical -timeout 10 -rate-limit 30 -bulk-size 15 -retries 1 -jsonl -silent`;

    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error && !stdout) {
        console.error("Nuclei error:", stderr);
        reject(error);
        return;
      }

      resolve(stdout || "");
    });
  });
};
