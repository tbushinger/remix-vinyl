FROM node:8.9-alpine

ENV NODE_ENV dev

WORKDIR /usr/app

# Because this image is being built on Docker Hub, the tsc command must be
# run inside the build process. With other build tools, you would compile ts 
# as part of the build process and only copy the compile JS into the image
RUN npm install -g typescript

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install

COPY . .

# Again, normally this should be done before an image is built
RUN npm run build-ts

EXPOSE 3000

CMD npm start