import {readFileSync} from "node:fs";
import {pool} from "../../database/database.js";

const sql = readFileSync(
    './scripts/SQL/initDB.sql',
    {encoding: "utf-8"}
);


try {
    await pool.query(sql);
    console.log("✅ Base initialisée");
} catch (e) {
    console.error("❌ Erreur initDB:", e);
} 