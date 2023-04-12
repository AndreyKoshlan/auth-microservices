FROM node:18

WORKDIR /usr/src/server
COPY tsconfig*.json .
COPY package*.json .
COPY nest-cli.json .
RUN npm install

WORKDIR /usr/src/server/apps/profile
COPY apps/profile/tsconfig*.json .
COPY apps/profile/package*.json .
RUN npm install

WORKDIR /usr/src/server
COPY apps/profile apps/profile
COPY libs libs