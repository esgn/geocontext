FROM node:20-alpine as builder

RUN apk add --no-cache stress-ng

RUN mkdir /opt/geocontext
WORKDIR /opt/geocontext

COPY package.json .
RUN npm install --omit=dev

COPY server.js .
COPY src src/
COPY public public/

USER node
EXPOSE 3000
CMD ["npm", "start"]
