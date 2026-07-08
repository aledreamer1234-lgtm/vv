import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

type DatabaseStatement = {
  run: (...args: Array<string | null>) => unknown;
  get: (...args: Array<string | null>) => unknown;
};

type DatabaseSyncLike = {
  prepare: (sql: string) => DatabaseStatement;
  exec: (sql: string) => void;
};

type NormalizedWaitlistEntry = {
  email: string;
  name: string | null;
  company: string | null;
  source: string;
  hostname: string;
  productInterest: string | null;
};

export type WaitlistSubmissionInput = {
  email: string;
  name?: string;
  company?: string;
  source?: string;
  hostname?: string;
  productInterest?: string;
};

export type WaitlistSubmissionRecord = {
  email: string;
  name: string | null;
  company: string | null;
  source: string;
  hostname: string;
  productInterest: string | null;
  createdAt: string;
  updatedAt: string;
  status: "created" | "updated";
};

const require = createRequire(import.meta.url);
const defaultDbPath = fileURLToPath(new URL("../.capri/waitlist.sqlite", import.meta.url));
const defaultJsonPath = join(tmpdir(), "capri-waitlist.json");

export function submitWaitlistEntry(input: WaitlistSubmissionInput, dbPath = process.env.CAPRI_WAITLIST_DB_PATH ?? defaultDbPath): WaitlistSubmissionRecord {
  const entry = normalizeSubmission(input);
  const timestamp = new Date().toISOString();

  const sqliteResult = trySubmitWithSqlite(entry, timestamp, dbPath);
  if (sqliteResult) return sqliteResult;

  // Works on Node 18/20 and serverless previews where node:sqlite is missing.
  // On Vercel this writes to /tmp, so it keeps the endpoint alive even without
  // provisioning a real database yet. Set CAPRI_WAITLIST_JSON_PATH to choose a
  // different writable file in self-hosted deployments.
  return submitWithJsonFile(entry, timestamp, process.env.CAPRI_WAITLIST_JSON_PATH ?? defaultJsonPath);
}

function trySubmitWithSqlite(entry: NormalizedWaitlistEntry, timestamp: string, dbPath: string): WaitlistSubmissionRecord | undefined {
  try {
    const sqlite = require("node:sqlite") as { DatabaseSync?: new (path: string) => DatabaseSyncLike };
    if (!sqlite.DatabaseSync) return undefined;

    mkdirSync(dirname(dbPath), { recursive: true });
    const database = new sqlite.DatabaseSync(dbPath);
    database.exec(`
      create table if not exists waitlist_submissions (
        email text primary key collate nocase,
        name text,
        company text,
        source text not null,
        hostname text not null,
        product_interest text,
        created_at text not null,
        updated_at text not null
      );
    `);

    const existing = database
      .prepare(
        `select email, name, company, source, hostname, product_interest as productInterest, created_at as createdAt
         from waitlist_submissions
         where email = ?`
      )
      .get(entry.email) as
      | {
          email: string;
          name: string | null;
          company: string | null;
          source: string;
          hostname: string;
          productInterest: string | null;
          createdAt: string;
        }
      | undefined;

    if (existing) {
      database
        .prepare(
          `update waitlist_submissions
           set name = ?, company = ?, source = ?, hostname = ?, product_interest = ?, updated_at = ?
           where email = ?`
        )
        .run(entry.name, entry.company, entry.source, entry.hostname, entry.productInterest, timestamp, entry.email);

      return {
        ...entry,
        createdAt: existing.createdAt,
        updatedAt: timestamp,
        status: "updated",
      };
    }

    database
      .prepare(
        `insert into waitlist_submissions
         (email, name, company, source, hostname, product_interest, created_at, updated_at)
         values (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(entry.email, entry.name, entry.company, entry.source, entry.hostname, entry.productInterest, timestamp, timestamp);

    return { ...entry, createdAt: timestamp, updatedAt: timestamp, status: "created" };
  } catch {
    return undefined;
  }
}

function submitWithJsonFile(entry: NormalizedWaitlistEntry, timestamp: string, filePath: string): WaitlistSubmissionRecord {
  mkdirSync(dirname(filePath), { recursive: true });
  const records = readJsonRecords(filePath);
  const existingIndex = records.findIndex((record) => record.email.toLowerCase() === entry.email.toLowerCase());

  if (existingIndex >= 0) {
    const existing = records[existingIndex];
    const updated: WaitlistSubmissionRecord = {
      ...entry,
      createdAt: existing.createdAt,
      updatedAt: timestamp,
      status: "updated",
    };
    records[existingIndex] = updated;
    writeFileSync(filePath, JSON.stringify(records, null, 2));
    return updated;
  }

  const created: WaitlistSubmissionRecord = { ...entry, createdAt: timestamp, updatedAt: timestamp, status: "created" };
  records.push(created);
  writeFileSync(filePath, JSON.stringify(records, null, 2));
  return created;
}

function readJsonRecords(filePath: string): WaitlistSubmissionRecord[] {
  if (!existsSync(filePath)) return [];
  try {
    const value = JSON.parse(readFileSync(filePath, "utf8")) as unknown;
    return Array.isArray(value) ? value.filter(isWaitlistRecord) : [];
  } catch {
    return [];
  }
}

function isWaitlistRecord(value: unknown): value is WaitlistSubmissionRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<WaitlistSubmissionRecord>;
  return typeof record.email === "string" && typeof record.createdAt === "string" && typeof record.updatedAt === "string";
}

function normalizeSubmission(input: WaitlistSubmissionInput): NormalizedWaitlistEntry {
  const email = String(input.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("A valid email address is required.");
  }

  return {
    email,
    name: cleanOptionalField(input.name, 120),
    company: cleanOptionalField(input.company, 120),
    source: cleanOptionalField(input.source, 120) ?? "unknown",
    hostname: cleanOptionalField(input.hostname, 120) ?? "unknown",
    productInterest: cleanOptionalField(input.productInterest, 120),
  };
}

function cleanOptionalField(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized) return null;
  return normalized.slice(0, maxLength);
}
