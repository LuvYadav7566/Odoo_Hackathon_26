const { execSync } = require("child_process");

const ports = [5000, 5173];

for (const port of ports) {
  try {
    const output = execSync(
      `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess"`,
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    );

    const processIds = [...new Set(output.split(/\s+/).map((value) => Number(value)).filter(Boolean))];
    for (const pid of processIds) {
      try {
        execSync(`powershell -NoProfile -Command "Stop-Process -Id ${pid} -Force"`, { stdio: "ignore" });
        console.log(`Freed port ${port} from process ${pid}`);
      } catch (error) {
        console.log(`Could not stop process ${pid} on port ${port}`);
      }
    }
  } catch (error) {
    // No listener on this port.
  }
}

