FROM oven/bun:latest

RUN curl -sSL https://navi-lang.org/install | bash

ENV PORT=10000
COPY package.json ./
COPY bun.lockb ./
COPY server ./server/

RUN bun run serve
