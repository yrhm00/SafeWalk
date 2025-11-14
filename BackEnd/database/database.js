import pg from "pg";

const pgPool = new pg.Pool({
    user: 'flo',
    host: 'localhost',
    database: 'safewalk',
    password: 'password',
    port: 5432
});

/* ----- Deuxième partie ----- */
export const pool = {
    query: async (query, params) => {
        try {
            return await pgPool.query(query, params);
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    end : () => {
        return pgPool.end();
    }
};

/* ----- Troisième partie ----- */
// Si nous fermons notre processus, nous fermerons automatiquement toutes les connexions ouvertes à la base de données
process.on("exit", () => {
   pgPool.end().then(() => console.log("pool closed"));
});