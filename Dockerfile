FROM node:22-slim

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
# RUN npm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev"]
