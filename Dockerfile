FROM node:lts-bullseye-slim AS base

WORKDIR /app
ENV NODE_ENV=development

RUN apt update && apt install -y --no-install-recommends \
openssl fonts-noto libcairo2 libpango-1.0-0 libjpeg62-turbo libgif7 librsvg2-bin \
&& rm -rf /var/lib/apt/lists/*


RUN npm install -g @nestjs/cli
COPY package*.json ./
RUN npm install

EXPOSE 4000
ENV PORT=4000

COPY . .
RUN npx prisma generate

ENV TZ=Asia/Aqtau

CMD ["npm", "run", "start:dev"]
