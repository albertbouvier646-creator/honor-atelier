import type { IncomingMessage, ServerResponse } from "node:http";
import { Readable } from "node:stream";

// This file is the Vercel Serverless Function entry point.
// It imports the TanStack Start SSR server built in dist/server/server.js
// and adapts the fetch-based API to the Node.js http format Vercel expects.

let serverModule: { fetch: (req: Request, env: unknown, ctx: unknown) => Promise<Response> } | null =
  null;

async function getServer() {
  if (!serverModule) {
    // Dynamic import of the built SSR bundle
    const mod = await import("../dist/server/server.js");
    serverModule = (mod.default ?? mod) as typeof serverModule;
  }
  return serverModule!;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const server = await getServer();

  // Reconstruct full URL from the incoming request
  const host = req.headers.host || "localhost";
  const protocol = (req.headers["x-forwarded-proto"] as string) || "https";
  const url = new URL(req.url ?? "/", `${protocol}://${host}`);

  // Read request body
  let body: BodyInit | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const chunks: Uint8Array[] = [];
    for await (const chunk of req as AsyncIterable<Buffer>) {
      chunks.push(chunk);
    }
    if (chunks.length > 0) {
      body = Buffer.concat(chunks);
    }
  }

  // Build a standard fetch Request from the Node.js IncomingMessage
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else {
      headers.set(key, value);
    }
  }

  const request = new Request(url.toString(), {
    method: req.method,
    headers,
    body,
    // @ts-expect-error — duplex required for streaming bodies in Node 18+
    duplex: "half",
  });

  // Call the SSR server
  const response = await server.fetch(request, {}, { waitUntil: () => {} });

  // Write status & headers back to the Vercel response
  res.statusCode = response.status;
  response.headers.forEach((value: string, key: string) => {
    res.setHeader(key, value);
  });

  // Stream or buffer the response body
  if (response.body) {
    const readable = Readable.fromWeb(response.body as Parameters<typeof Readable.fromWeb>[0]);
    readable.pipe(res);
  } else {
    res.end();
  }
}
