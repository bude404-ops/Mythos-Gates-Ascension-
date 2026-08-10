import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';

const message = process.argv.slice(2).join(' ').trim() || process.env.TG_COMMIT_MESSAGE || 'chore: sync approved titan gates changes';
if (/^(update|stuff|changes|test)$/i.test(message)) {
  console.error('Refusing meaningless commit message. Use a specific message.');
  process.exit(1);
}
function run(cmd, args, opts = {}) {
  console.log(`$ ${cmd} ${args.join(' ')}`);
  return execFileSync(cmd, args, { stdio: opts.capture ? 'pipe' : 'inherit', encoding: 'utf8' });
}
function safeStatus(status, patch = {}) {
  const next = { ...status, ...patch, lastPushTime: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z') };
  writeFileSync('data/github-sync-status.json', JSON.stringify(next, null, 2) + '\n');
  return next;
}
const status = JSON.parse(readFileSync('data/github-sync-status.json', 'utf8'));
run('npm', ['run', 'build']);
run('node', ['scripts/visual-qa-smoke.mjs']);
run('node', ['scripts/secret-scan.mjs']);
const large = [];
for (const path of run('git', ['ls-files', '--others', '--modified', '--exclude-standard'], { capture: true }).split('\n').filter(Boolean)) {
  if (/^art\//.test(path) && existsSync(path) && statSync(path).size > 50 * 1024 * 1024) large.push(path);
}
if (large.length) {
  safeStatus(status, { status: 'SYNC_ERROR', github: 'SYNC_ERROR', deployment: 'NOT_STARTED', recentChanges: [`Large asset requires storage decision: ${large.join(', ')}`] });
  console.error(JSON.stringify({ ok: false, reason: 'large_asset_requires_creator_storage_decision', files: large }, null, 2));
  process.exit(1);
}
const changed = run('git', ['status', '--short'], { capture: true }).trim();
if (!changed) {
  console.log(JSON.stringify({ ok: true, status: 'SYNCED', reason: 'no_changes' }, null, 2));
  process.exit(0);
}
safeStatus(status, { status: 'CHANGES_PENDING', github: 'CHANGES_PENDING', deployment: 'NOT_STARTED', commitMessage: message });
run('git', ['add', '-A']);
run('git', ['commit', '-m', message]);
const commit = run('git', ['rev-parse', '--short', 'HEAD'], { capture: true }).trim();
safeStatus(JSON.parse(readFileSync('data/github-sync-status.json', 'utf8')), { status: 'CHANGES_PENDING', commit, commitMessage: message });
run('git', ['add', 'data/github-sync-status.json']);
run('git', ['commit', '--amend', '--no-edit']);
try {
  run('git', ['push', 'origin', 'HEAD:main']);
  const finalCommit = run('git', ['rev-parse', '--short', 'HEAD'], { capture: true }).trim();
  safeStatus(JSON.parse(readFileSync('data/github-sync-status.json', 'utf8')), { status: 'SYNCED', github: 'SYNCED', build: 'PASS', visualQa: 'PASS', deployment: 'IN_PROGRESS', commit: finalCommit, commitMessage: message });
  run('git', ['add', 'data/github-sync-status.json']);
  run('git', ['commit', '--amend', '--no-edit']);
  run('git', ['push', '--force-with-lease', 'origin', 'HEAD:main']);
  console.log(JSON.stringify({ ok: true, pushed: true, commit: finalCommit, deployment: 'IN_PROGRESS' }, null, 2));
} catch (err) {
  safeStatus(JSON.parse(readFileSync('data/github-sync-status.json', 'utf8')), { status: 'SYNC_ERROR', github: 'SYNC_ERROR', deployment: 'NOT_STARTED' });
  console.error('GITHUB PUSH FAILED');
  console.error(String(err.message || err).replace(/github_pat_[A-Za-z0-9_]+/g, '[REDACTED]').replace(/gh[pousr]_[A-Za-z0-9_]+/g, '[REDACTED]'));
  process.exit(1);
}
