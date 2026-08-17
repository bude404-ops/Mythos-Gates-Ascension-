import { spawn } from 'node:child_process';

const attempts = 4;
let lastCode = 1;

for (let attempt = 1; attempt <= attempts; attempt++) {
  const result = await run('node', ['scripts/test-command-hub.mjs']);
  lastCode = result.code;
  if (result.code === 0) {
    process.exit(0);
  }
  if (!/Page crashed|Target page|browser has been closed|Timeout/i.test(result.output)) {
    process.exit(result.code || 1);
  }
  if (attempt < attempts) await delay(2500 * attempt);
}

process.exit(lastCode || 1);

function run(command, args) {
  return new Promise(resolve => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'], env: process.env });
    let output = '';
    child.stdout.on('data', chunk => { const text = chunk.toString(); output += text; process.stdout.write(text); });
    child.stderr.on('data', chunk => { const text = chunk.toString(); output += text; process.stderr.write(text); });
    child.on('close', code => resolve({ code, output }));
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
