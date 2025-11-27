FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p data

EXPOSE 3002

CMD ["npm", "start"]
