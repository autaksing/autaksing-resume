import { readFile, writeFile } from "node:fs/promises";

// The installed Vite adapter emits an option removed in newer Wrangler releases.
const path = "dist/server/wrangler.json";
const config = JSON.parse(await readFile(path, "utf8"));
delete config.legacy_env;
await writeFile(path, JSON.stringify(config, null, 2) + "\n");
