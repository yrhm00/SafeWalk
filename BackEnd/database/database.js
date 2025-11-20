import "dotenv/config";
import pg from "pg";

// Création du pool
const pgPool = new pg.Pool({
    host: process.env.PGHOST,       
    port: process.env.PGPORT,       
    user: process.env.PGUSER,       
    password: process.env.PGPASSWORD, 
    database: process.env.PGDATABASE 
});

/* ----- Deuxième partie ----- */
export const pool = {
    query: async (query, params) => {
        try {
            return await pgPool.query(query, params);
        } catch (e) {
            console.error("❌ Erreur DB:", e);
            throw e;
        }
    },
    end: () => {
        return pgPool.end();
    }
};

/* ----- Troisième partie ----- */
// Ferme proprement le pool quand le processus s'arrête

// -------------------------------------------------
// 📌 FERMETURE DU POOL LORSQUE LE PROCESS S'ARRÊTE
// -------------------------------------------------

// CTRL + C
process.on("SIGINT", async () => {
    console.log("\n🔌 CTRL+C détecté : fermeture du pool...");
    await pgPool.end();
    console.log("✔️ Pool fermé");
    process.exit(0);
});

// kill / docker stop / pm2 stop / shutdown propre
process.on("SIGTERM", async () => {
    console.log("\n🛑 SIGTERM détecté : fermeture du pool...");
    await pgPool.end();
    console.log("✔️ Pool fermé");
    process.exit(0);
});