FROM node:18

WORKDIR /usr/src/server
COPY tsconfig*.json .
COPY package*.json .
COPY nest-cli.json .
RUN npm install

WORKDIR /usr/src/server
COPY apps/root apps/root
COPY libs libs