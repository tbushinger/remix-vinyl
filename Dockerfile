# Build typescript artifacts
FROM node:8.9-alpine as builder
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent
COPY . .
RUN npm run build-ts

# Package application
FROM node:8.9-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist /usr/src/app/dist
COPY --from=builder /usr/src/app/package.json* /usr/src/app

RUN npm install --production --silent && mv node_modules ../

EXPOSE 3000

CMD npm start