FROM oven/bun:latest

RUN curl -sSL https://navi-lang.org/install | bash

COPY package.json ./
COPY bun.lockb ./
COPY server ./server/

RUN bun run serve
