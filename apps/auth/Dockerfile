FROM node:18

WORKDIR /usr/src/server
COPY tsconfig*.json .
COPY package*.json .
COPY nest-cli.json .
RUN npm install

WORKDIR /usr/src/server/apps/auth
COPY apps/auth/tsconfig*.json .
COPY apps/auth/package*.json .
RUN npm install

WORKDIR /usr/src/server
COPY apps/auth apps/auth
COPY libs libs