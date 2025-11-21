import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pgPool = new pg.Pool({
    user: process.env.USERDB,
    host: process.env.HOSTDB,
    database: process.env.DBNAME,
    password: process.env.PASSWORDDB,
    port: 5432
});

/* ----- Pattern Adapter ----- */
export const pool = {
    query: async (query, params) => {
        try {
            return await pgPool.query(query, params);
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    end: () => {
        return pgPool.end();
    }
};

/* ----- Fermeture propre du pool ----- */
// Si nous fermons notre processus, nous fermerons automatiquement toutes les connexions ouvertes à la base de données
process.on("exit", () => {
    pgPool.end().then(() => console.log("pool closed"));
});