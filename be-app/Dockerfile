# Dockerfile for be-app
FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD node index.js

EXPOSE 3000

