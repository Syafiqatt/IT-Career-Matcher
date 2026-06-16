import pg from "pg";
import { config } from "../config/index.js";

const { Pool } = pg;

// Satu connection pool dipakai bersama seluruh aplikasi.
export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

export const query = (text, params) => pool.query(text, params);
