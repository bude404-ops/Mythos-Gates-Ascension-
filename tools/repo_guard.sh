#!/usr/bin/env bash
# REPO GUARD — auto-commit + auto-push any Mythos vault working tree.
# Survives sandbox crashes: nothing stays un-pushed longer than one sweep.
# Usage: repo_guard.sh [repo_dir]   (defaults to the dir containing this script's parent)
set -u
REPO="${1:-$(cd "$(dirname "$0")/.." && pwd)}"
cd "$REPO" || exit 1
[ -d .git ] || { echo "not a git repo: $REPO"; exit 1; }
git config user.email "bigagent404@bigfoot404.biz" 2>/dev/null
git config user.name "BIGagent404" 2>/dev/null

# make sure the github remote exists (survives fresh clones)
if ! git remote get-url github >/dev/null 2>&1; then
  TOKEN="${GITHUB_TOKEN:-}"
  [ -z "$TOKEN" ] && { echo "no github remote and no GITHUB_TOKEN"; exit 1; }
  git remote add github "https://$TOKEN@github.com/bude404-ops/Mythos-Gates-Ascension-.git"
fi

if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -q -m "Repo Guard auto-sync: $(date -u +%Y-%m-%dT%H:%MZ) — uncommitted work preserved from sandbox risk" || true
  echo "$REPO: committed pending work"
fi

if [ -n "$(git log github/main..HEAD --oneline 2>/dev/null)" ]; then
  git push github main >/dev/null 2>&1 && echo "$REPO: pushed to github main" || echo "$REPO: PUSH FAILED"
else
  echo "$REPO: up to date"
fi
