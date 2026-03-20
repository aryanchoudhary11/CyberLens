export const parseNmapOutput = (output) => {
  const lines = output.split("\n");
  const openPorts = [];

  lines.forEach((line) => {
    if (line.includes("/tcp") && line.includes("open")) {
      const parts = line.trim().split(/\s+/);

      const port = parts[0].split("/")[0];
      const service = parts[2];
      const version = parts.slice(3).join(" ") || "";

      openPorts.push({
        port: Number(port),
        service,
        version,
      });
    }
  });

  return openPorts;
};
