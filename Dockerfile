# syntax=docker/dockerfile:1
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "RUN start"]
EXPOSE 3000