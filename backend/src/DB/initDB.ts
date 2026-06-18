import fs from "fs";
import path from "path";
import { pool } from "../config/db";

export async function initDB(): Promise<void> {
  const schemaPath = path.join(process.cwd(), "src", "DB", "schema.sql");

  const schema = fs.readFileSync(schemaPath, "utf8");

  await pool.query(schema);
  console.log("Database tables ready");
}
