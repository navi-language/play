import { spawn } from "child_process";
import { randomUUID } from "crypto";
import { tmpdir } from "os";

const PORT = process.env.PORT || 3000;
const SPAWN_TIMEOUT = 10000;
const TIMEOUT_MESSAGE = `Execution timeout, the maximum allowed time is ${SPAWN_TIMEOUT / 1000}s.`;

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
  if (result.exitCode != 0) {
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
  if (result.exitCode != 0) {
    const error = result.stderr || result.stdout;
    return newResponse({ error }, 400);
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

    return this.exec("navi", ["run", tmpFile]);
  }

  static async format(source: string) {
    return this.exec("navi", ["fmt", "--stdin", "--emit", "stdout"], {
      input: source,
    });
  }

  static async exec(
    command: string,
    args: string[],
    options: {
      input?: string;
    } = {},
  ): Promise<{ exitCode: number; stdout: string; stderr: string }> {
    // args.unshift(command);
    const child = spawn(command, args, {
      stdio: "pipe",
      timeout: SPAWN_TIMEOUT,
    });

    if (options.input) {
      child.stdin?.write(options.input);
      child.stdin?.end();
    }

    return new Promise((resolve) => {
      const result = { exitCode: -1, stdout: "", stderr: "" };

      child.stdout?.on("data", (data) => {
        result.stdout += data;
      });

      child.stderr?.on("data", (data) => {
        result.stderr += data;
      });

      child.on("exit", (code) => {
        if (code === null) {
          code = -1;
          result.stderr = TIMEOUT_MESSAGE;
        }

        result.exitCode = code || 0;
        // console.log("exit", code, result);
        resolve(result);
      });
    });
  }
}
