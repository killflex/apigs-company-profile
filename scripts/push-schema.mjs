import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
config({ path: join(__dirname, "..", ".env.local") });

// Run drizzle-kit push
execSync("pnpm drizzle-kit push", {
  stdio: "inherit",
  env: process.env,
  cwd: join(__dirname, ".."),
});
