import {readFileSync} from "node:fs";
import {pool} from "../../database/database.js";

const requests = readFileSync(
    './scripts/SQL/initDB.sql',
    {encoding: "utf-8"}
);

// NOTE: les valeurs de `password_hash` dans initDB.sql doivent être de vrais hash bcrypt.
// Tu peux les générer une fois avec un petit script Node utilisant `hashPassword` de `utils/password.js`
// et remplacer 'hash_admin', 'hash_yassin', etc. dans le fichier SQL par ces hash.
// Exemple de script rapide (à mettre dans un fichier séparé si besoin) :
// import { hashPassword } from '../../utils/password.js';
// const hash = await hashPassword('Admin123!'); console.log(hash);
// Puis copier-coller le hash dans initDB.sql.

try {
    await pool.query(requests, []);
    console.log("done");
} catch (e) {
    console.error(e);
}