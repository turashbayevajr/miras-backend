FROM node:lts-bullseye-slim AS base

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
ENV TZ=Asia/Aqtau

RUN apt update && apt install -y --no-install-recommends \
  openssl fonts-noto libcairo2 libpango-1.0-0 libjpeg62-turbo libgif7 librsvg2-bin \
  && rm -rf /var/lib/apt/lists/*

# Install only prod deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source and prisma
COPY prisma ./prisma
COPY tsconfig*.json ./
COPY src ./src

# Generate Prisma Client & build app
RUN npx prisma generate
RUN npm run build
RUN npm run seed
# Expose port and set CMD
EXPOSE 4000
CMD ["npm", "run", "start:prod"]
