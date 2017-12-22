FROM node:6.10.1-alpine

ARG release=local

ENV RELEASE $release

RUN mkdir /app

WORKDIR /app

# Install production dependencies
COPY package.json .
RUN npm install --production

ADD dist/ /app/

CMD ["node", "/app/server.js"]