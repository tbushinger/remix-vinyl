FROM node:8.9-alpine

WORKDIR /usr/src/app

COPY ["package.json","package-lock.json", "./"]

RUN npm install

COPY . .

CMD npm test