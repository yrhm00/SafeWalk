import { readFileSync } from "node:fs";
import { pool } from "../../backend/database/database.js";

const requests = readFileSync('./scripts/SQL/initDB.sql', { encoding: "utf-8" });

try {
    await pool.query(requests, []);
    console.log("✅ Database initialized successfully");
    process.exit(0);
} catch (e) {
    console.error("❌ Error initializing database:");
    console.error(e);
    process.exit(1);
}