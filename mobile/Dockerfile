# Expo SDK 58 requires Node.js 22.13 or newer.
FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./

EXPOSE 8081
# expo-dev-client é uma dependência do projeto e, sem --go, o Expo CLI
# seleciona Development Build automaticamente.
CMD ["npx", "expo", "start", "--go", "--lan", "--port", "8081"]
