import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
// Keep emulated R2 outside dist: Vite clears dist on every build.
const child=spawn(process.execPath,[resolve(root,'node_modules/wrangler/bin/wrangler.js'),'dev','--config',resolve(root,'dist/server/wrangler.json'),'--persist-to',resolve(root,'.wrangler/state'),'--port','8787'],{cwd:root,stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??0));
