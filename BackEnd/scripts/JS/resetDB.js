import { readFileSync } from "node:fs";
import { pool } from "../../database/database.js";

const init = readFileSync("./scripts/SQL/initDB.sql", "utf-8");
const seed = readFileSync("./scripts/SQL/seedDB.sql", "utf-8");

try {
    await pool.query(init);
    await pool.query(seed);
    console.log("♻️ Base réinitialisée");
} catch (e) {
    console.error("❌ Erreur resetDB:", e);
}
