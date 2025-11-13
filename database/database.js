import pg from "pg";
import "dotenv/config";

const pgPool = new pg.Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

export const pool = {
    query: async (query, params) => {
        try {
            return await pgPool.query(query, params);
        } catch (err) {
            console.error("Erreur SQL :", err.message);
            throw err;
        }
    },
    end: () => pgPool.end()
};

process.on("exit", () => {
    pgPool.end().then(() => console.log("Connexion PostgreSQL fermée."));
});