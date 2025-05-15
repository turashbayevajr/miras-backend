# ---------- Dockerfile ----------
FROM node:lts-bullseye-slim

# App settings
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
ENV TZ=Asia/Aqtau

# Install system libraries needed for image/font handling
RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl \
  fonts-noto \
  libcairo2 \
  libpango-1.0-0 \
  libjpeg62-turbo \
  libgif7 \
  librsvg2-bin \
  && rm -rf /var/lib/apt/lists/*

# Install app dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source files
COPY prisma ./prisma
COPY tsconfig*.json ./
COPY src ./src

# Generate Prisma Client and build app
RUN npx prisma generate
RUN npm run build

# Optional: Run seed (ensure it is idempotent)
RUN npm run seed || echo "Seed failed or already applied"

# Expose port and start the app
EXPOSE 4000
CMD ["npm", "run", "start:prod"]
