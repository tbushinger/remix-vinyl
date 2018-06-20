FROM node:8.9-alpine

ENV NODE_ENV dev

WORKDIR /usr/app

RUN npm install -g typescript

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install

COPY . .

RUN npm run build-ts

EXPOSE 3000

CMD npm start