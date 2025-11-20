import { pool } from "../../database/database.js";

try {
    const res = await pool.query("SELECT NOW()");
    console.log("🔥 Connexion OK :", res.rows[0]);
} catch (e) {
    console.error(e);
}