/**
 * Migrasi sederhana: membuat database (jika belum ada) lalu menerapkan schema.sql.
 * Jalankan: npm run migrate
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import { config } from "../config/index.js";

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function ensureDatabase() {
  // Koneksi ke database administratif 'postgres' untuk membuat database target.
  const admin = new Client({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: "postgres",
  });
  await admin.connect();
  const exists = await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", [
    config.db.database,
  ]);
  if (exists.rowCount === 0) {
    await admin.query(`CREATE DATABASE "${config.db.database}"`);
    console.log(`✓ Database "${config.db.database}" dibuat.`);
  } else {
    console.log(`• Database "${config.db.database}" sudah ada.`);
  }
  await admin.end();
}

async function applySchema() {
  const client = new Client({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
  });
  await client.connect();
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  await client.query(sql);
  console.log("✓ Skema diterapkan (tabel 'recommendations' siap).");
  await client.end();
}

(async () => {
  try {
    await ensureDatabase();
    await applySchema();
    console.log("Migrasi selesai.");
    process.exit(0);
  } catch (err) {
    console.error("Migrasi gagal:", err.message);
    process.exit(1);
  }
})();
