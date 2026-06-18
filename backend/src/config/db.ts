import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = (process.env.DATABASE_URL ?? "").replace(
  /sslmode=require\b/g,
  "sslmode=verify-full",
);

export const pool = new Pool({ connectionString });
