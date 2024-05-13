FROM debian

RUN apt update && apt install -y curl unzip
RUN curl -fsSL https://bun.sh/install | bash
RUN curl -sSL https://navi-lang.org/install | bash -s -- nightly

ENV PATH /root/.navi:$PATH
ENV NODE_ENV production
ENV PORT 10000

COPY package.json ./
COPY bun.lockb ./
COPY server ./server/

CMD ["bun", "run", "serve"]
