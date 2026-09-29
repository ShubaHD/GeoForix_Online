import path from "path";
import fs from "fs/promises";
import { get, put } from "@vercel/blob";

export const STORAGE_ROOT = path.join(process.cwd(), "storage");

function blobEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export function safeName(name: string) {
  return name.replace(/[^\w.\- ()\[\]]+/g, "_").slice(0, 180);
}

function guessContentType(name: string) {
  const ext = path.extname(name).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".pdf") return "application/pdf";
  return "image/jpeg";
}

export async function saveUpload(
  relativeDir: string,
  originalName: string,
  bytes: Buffer,
) {
  const filename = `${Date.now()}_${safeName(originalName)}`;
  const key = `${relativeDir}/${filename}`.replace(/\\/g, "/");

  if (blobEnabled()) {
    await put(key, bytes, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: guessContentType(originalName),
    });
    return key;
  }

  const dir = path.join(STORAGE_ROOT, relativeDir);
  await ensureDir(dir);
  await fs.writeFile(path.join(dir, filename), bytes);
  return key;
}

export async function readUpload(key: string): Promise<Buffer> {
  if (blobEnabled()) {
    const result = await get(key, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) {
      throw new Error("Blob not found");
    }
    return streamToBuffer(result.stream);
  }
  return fs.readFile(path.join(STORAGE_ROOT, key));
}

async function streamToBuffer(
  stream: ReadableStream<Uint8Array> | NodeJS.ReadableStream,
) {
  if ("getReader" in stream) {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    return Buffer.concat(chunks.map((c) => Buffer.from(c)));
  }
  const chunks: Buffer[] = [];
  for await (const chunk of stream as NodeJS.ReadableStream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
