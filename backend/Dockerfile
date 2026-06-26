FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY server.js .
COPY public/ ./public/

RUN mkdir -p /dados

EXPOSE 3000

CMD ["node", "server.js"]
