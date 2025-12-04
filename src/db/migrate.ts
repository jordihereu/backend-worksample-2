import fs from "fs";
import path from "path";
import { getPool } from "./pool";

export async function runMigrations() {
  const pool = getPool()

  const migrationPath = path.join(__dirname, "migrations");
  const files = fs.readdirSync(migrationPath);

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationPath, file), "utf8");
    await pool.query(sql);
  }
}