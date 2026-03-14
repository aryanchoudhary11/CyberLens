import { exec } from "child_process";

export const runNucleiScan = (target) => {
  return new Promise((resolve, reject) => {
    const command = `nuclei -u ${target} -json`;

    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error("Nuclei scan error:", error);
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
};
