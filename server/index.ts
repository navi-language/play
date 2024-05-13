import { stdin } from "bun";
import { spawnSync } from "child_process";
import { randomUUID } from "crypto";
import { tmpdir } from "os";

const PORT = process.env.PORT || 3000;

const CORS_HEADERS = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
  },
};

console.log(`Server is running on port ${PORT}`);
console.log(`http://localhost:${PORT}`);

Bun.serve({
  port: PORT,
  async fetch(req) {
    const path = new URL(req.url).pathname;

    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      const res = new Response("", CORS_HEADERS);
      return res;
    }

    if (req.method === "POST" && path === "/execute") {
      return await handleExecute(req);
    }
    if (req.method === "POST" && path === "/format") {
      return await handleFormat(req);
    }

    return newResponse("Navi playground", 200);
  },
});

// POST /format
async function handleFormat(req: Request) {
  const payload = await req.json();
  const { source } = payload;

  if (!source) {
    return new Response("No source code provided", { status: 200 });
  }

  const result = await NaviCommand.format(source);
  if (result.error) {
    return newResponse({ error: result.stderr.toString() }, 400);
  }

  return newResponse({ out: result.stdout.toString() }, 200);
}

// POST /execute
async function handleExecute(req: Request) {
  const payload = await req.json();
  const { source } = payload;

  if (!source) {
    return new Response("No source code provided", { status: 200 });
  }

  const result = await NaviCommand.run(source);
  if (result.error) {
    return newResponse({ error: result.stdout.toString() }, 400);
  }

  return newResponse({ out: result.stdout.toString() }, 200);
}

function newResponse(
  data: Record<string, string> | string,
  status: number,
): Response {
  let body = "";
  if (typeof data === "string") {
    body = data;
  } else {
    body = JSON.stringify(data);
  }
  const res = new Response(body, { ...CORS_HEADERS, status });
  return res;
}

class NaviCommand {
  static async run(source: string) {
    const tmpFile = tmpdir() + "/" + randomUUID() + ".nv";
    Bun.write(tmpFile, source);

    return spawnSync("navi", ["run", tmpFile]);
  }

  static async format(source: string) {
    return spawnSync("navi", ["fmt", "--stdin", "--emit", "stdout"], {
      input: source,
    });
  }
}
