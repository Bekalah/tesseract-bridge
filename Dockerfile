# Node-based deployment for the tesseract-bridge API service.
# No bundlers, no static build steps — we only expose JSON endpoints.
FROM node:20-alpine AS base

WORKDIR /app

# Copy dependency manifest first for better Docker layer caching.
COPY package*.json ./

RUN npm install --omit=dev

# Copy the remainder of the repository (registry data, server code, docs).
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.mjs"]
