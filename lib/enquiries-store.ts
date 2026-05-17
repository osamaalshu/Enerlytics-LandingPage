import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getStore } from "@netlify/blobs";

export type EnquiryRecord = {
  id: string;
  createdAt: string;
  name: string;
  company: string;
  email: string;
  consumption: string;
  consumptionLabel: string;
  message: string;
};

const STORE_NAME = "demo-enquiries";
const STORE_PREFIX = "enquiries/";
const LOCAL_FILE_PATH = path.join(process.cwd(), "data", "enquiries.json");

function canUseNetlifyBlobs() {
  return Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT);
}

async function readLocalEnquiries() {
  try {
    const raw = await readFile(LOCAL_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as EnquiryRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeLocalEnquiries(enquiries: EnquiryRecord[]) {
  await mkdir(path.dirname(LOCAL_FILE_PATH), { recursive: true });
  await writeFile(LOCAL_FILE_PATH, JSON.stringify(enquiries, null, 2), "utf8");
}

export async function saveEnquiry(
  input: Omit<EnquiryRecord, "id" | "createdAt">,
): Promise<void> {
  const record: EnquiryRecord = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  if (!canUseNetlifyBlobs()) {
    const current = await readLocalEnquiries();
    current.unshift(record);
    await writeLocalEnquiries(current);
    return;
  }

  const store = getStore(STORE_NAME);
  const key = `${STORE_PREFIX}${record.createdAt}_${record.id}.json`;
  await store.setJSON(key, record);
}

export async function listEnquiries(): Promise<EnquiryRecord[]> {
  if (!canUseNetlifyBlobs()) {
    return readLocalEnquiries();
  }

  const store = getStore(STORE_NAME);
  const { blobs } = await store.list({ prefix: STORE_PREFIX });

  const entries = await Promise.all(
    blobs.map(async (blob) => {
      const data = await store.get(blob.key, { type: "json" });
      return data as EnquiryRecord | null;
    }),
  );

  return entries
    .filter((entry): entry is EnquiryRecord => Boolean(entry))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
