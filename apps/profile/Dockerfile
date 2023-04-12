FROM node:18

WORKDIR /usr/src/server/apps/profile
COPY apps/profile .
RUN npm install

WORKDIR /usr/src/server/
COPY libs .
COPY tsconfig*.json .
COPY package*.json .
COPY nest-cli.json .
RUN npm install