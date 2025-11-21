import { pool } from "../../database/database.js";
import { readPerson } from "../../src/model/person.js";

/**
 * Middleware d'identification Basic
 * Extrait les credentials du header Authorization: Basic ...
 * Vérifie l'email et le mot de passe
 * Ajoute req.session = {id, role} si succès
 */
export const checkBasic = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.sendStatus(401);
    }

    try {
        // Extraire et décoder le token Basic
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [email, password] = credentials.split(':');

        if (!email || !password) {
            return res.sendStatus(401);
        }

        // Vérifier les credentials
        const person = await readPerson(pool, { email, password });

        if (person.id && person.role) {
            // Ajouter les informations de session
            req.session = {
                id: person.id,
                role: person.role
            };
            next();
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        console.error("Error in checkBasic middleware:", error);
        res.sendStatus(401);
    }
};
