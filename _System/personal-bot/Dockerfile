FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY bot.js ./

CMD ["node", "bot.js"]
