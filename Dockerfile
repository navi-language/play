FROM debian

RUN apt update && apt install -y curl unzip
RUN curl -fsSL https://bun.sh/install | bash

ENV PATH /root/.navi:/root/.bun/bin/:$PATH
ENV NODE_ENV production
ENV PORT 10000

COPY package.json ./
COPY bun.lockb ./
COPY server ./server/

RUN bun install --production
RUN curl -sSL https://navi-lang.org/install | bash -s -- nightly

CMD ["bun", "run", "serve"]
