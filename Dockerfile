FROM oven/bun:latest

RUN apt-get update && apt-get install -y curl

ENV PATH /root/.navi:$PATH
ENV NODE_ENV production
ENV PORT 10000

RUN curl -sSL https://navi-lang.org/install | bash

COPY package.json ./
COPY bun.lockb ./
COPY server ./server/

CMD ["bun", "run", "serve"]
