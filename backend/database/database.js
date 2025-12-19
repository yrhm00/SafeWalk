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

export const pool = {
    query: async (query, params) => {
        try {
            return await pgPool.query(query, params);
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    connect: async () => {
        return await pgPool.connect();
    },
    end: () => {
        return pgPool.end();
    }
};

process.on("exit", () => {
    pgPool.end().then(() => console.log("pool closed"));
});