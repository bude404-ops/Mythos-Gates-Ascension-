# Automatic GitHub Sync and Deployment Policy

**Codex ID:** TG-GITHUB-SYNC-POLICY-001  
**Status:** Canon Locked  
**Updated:** 2026-08-10

## Source of Truth

GitHub `main` is the authoritative persisted state for Titan Gates. Temporary browser, preview, runtime, or local development state is never enough.

## Required Pipeline

**BUILD → VISUAL TEST → APPROVE → GITHUB → DEPLOY → VERIFY**

A change is not complete unless it is pushed to GitHub. Deployment is not complete unless GitHub Pages reports success or the deployed artifact is verified.

## Required Push Categories

All approved changes must be committed and pushed when they alter:

- code
- game data
- lore
- artwork metadata or approved asset references
- sprites, portraits, cinematics, 3D environments, Gates, locations
- director data
- development tasks
- Visual QA data
- version/build information
- entity registry data

## Secure Authentication Rule

GitHub credentials must never appear in frontend code, GitHub Pages, public JavaScript, JSON data, asset manifests, localStorage, or build output.

Use only secure local environment variables, GitHub Actions secrets, GitHub Apps, or server-side authentication.

## Push Failure Rule

If GitHub rejects a push, the platform must show **SYNC ERROR** and Reaper must report the safe reason without exposing credentials.

## Deployment Rule

Do not claim GitHub Pages deployment succeeded until Actions/Pages reports success or the deployed artifact is checked.

## Large Artwork Rule

Before committing approved artwork, check file size. Large assets must stop for Creator approval with a storage strategy such as Git LFS or external asset storage.
