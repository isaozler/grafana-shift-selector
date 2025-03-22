# Use a Node.js base image
FROM node:22-slim

RUN apt-get update && apt-get install -y \
    g++ \
    libc6-dev \
    libgcc-12-dev \
    make \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --unsafe-perm

COPY . .

CMD ["pnpm", "dev"]
