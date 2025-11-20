import { readFileSync } from "node:fs";
import { pool } from "../../database/database.js";

const sql = readFileSync("./scripts/SQL/seedDB.sql", "utf-8");

try {
    await pool.query(sql);
    console.log("🌱 Données insérées");
} catch (e) {
    console.error("❌ Erreur seedDB:", e);
}
