FROM node:20-slim

WORKDIR /app

# Copy only package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy only essential files for the build (excludes .git, art revisions, engine, missions)
COPY index.html ./
COPY game/ ./game/
COPY mini-app/ ./mini-app/
COPY data/ ./data/
COPY docs/ ./docs/
COPY art/approved/ ./art/approved/
COPY art/maps/ ./art/maps/
COPY art/mission-packages/ ./art/mission-packages/
COPY art/prompts/ ./art/prompts/
COPY art/3d-models/ ./art/3d-models/
COPY artwork_import/ ./artwork_import/
COPY dev/ ./dev/
COPY visual/ ./visual/
COPY assets/ ./assets/
COPY asset_registry/ ./asset_registry/
COPY blueprints/ ./blueprints/
COPY manifests/ ./manifests/
COPY handoff/ ./handoff/
COPY validation/ ./validation/
COPY tools/ ./tools/
COPY scripts/ ./scripts/
COPY 3D_Blueprints/ ./3D_Blueprints/
COPY README.md ./

# Build the static site
RUN npm run index && node scripts/build-pages.mjs

# Serve the static site
CMD node_modules/.bin/serve dist -l ${PORT:-3000}
