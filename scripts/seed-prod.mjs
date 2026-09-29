import dotenv from "dotenv";
dotenv.config({ path: ".env.vercel", override: true });

import { spawnSync } from "child_process";

const url = process.env.DATABASE_URL || "";
if (!url.startsWith("postgres")) {
  console.error("DATABASE_URL is not Postgres:", url.slice(0, 40));
  process.exit(1);
}
console.log("Seeding against", url.replace(/:[^:@]+@/, ":****@").split("?")[0]);

const scripts = [
  "prisma/seed.ts",
  "prisma/seed-bh50.ts",
  "prisma/seed-bh30-bh100.ts",
];

for (const script of scripts) {
  console.log("\n---", script, "---");
  const r = spawnSync("npx", ["tsx", script], {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  if (r.status) process.exit(r.status);
}
