FROM oven/bun:latest

RUN curl -sSL https://navi-lang.org/install | bash

ENV NODE_ENV production
ENV PORT 10000

COPY package.json ./
COPY bun.lockb ./
COPY server ./server/

CMD ["bun", "run", "serve"]
