import {pool} from "../database/database.js";
import * as userModel from "../model/user.js";
import { hashPassword } from "../utils/password.js";

export async function getUser(req, res) {
    try {
        const rawId = req.params.id;
        const id = Number(rawId);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'ID invalide' });
        }
        const { rows } = await pool.query(
            'SELECT id, username, email, role FROM "users" WHERE id = $1',
            [id]
        );
        if (!rows.length) {
            return res.status(404).json({ error: 'User introuvable' });
        }
        return res.json(rows[0]);
    } catch (e) {
        console.error('GET /users/:id error:', e);
        return res.status(500).json({ error: 'Erreur interne' });
    }
}

export const addUser = async (req, res) => {
    try {
        const { password, ...rest } = req.body || {};
        if (!password) {
            return res.status(400).json({ error: 'Mot de passe manquant' });
        }

        const password_hash = await hashPassword(password);

        const id = await userModel.createUser(pool, {
            ...rest,
            password_hash,
        });
        res.status(201).json({id});
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};
export const updateUser = async (req, res) => {
    try {
        if (!req.body || req.body.id == null) {
            return res.status(400).json({ error: 'id manquant pour la mise à jour de l\'utilisateur' });
        }

        const { password, ...rest } = req.body;
        let password_hash;
        if (password) {
            password_hash = await hashPassword(password);
        }

        await userModel.updateUser(pool, {
            ...rest,
            password_hash,
        });
        res.sendStatus(204);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};
export const deleteUser = async (req, res) => {
    try {
        if (!req.params || req.params.id == null) {
            return res.status(400).json({ error: 'id manquant pour la suppression de l\'utilisateur' });
        }
        await userModel.deleteUser(pool, req.params);
        res.sendStatus(204);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

// Mise a jour du citizen connecte via Basic Auth (exercice 1 du labo)
export const updateSelfUser = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({ error: 'Non authentifie' });
        }

        const { name, username, email, password } = req.body || {};

        // si aucun champ autorise n'est fourni, on signale une erreur claire
        if (!name && !username && !email && !password) {
            return res.status(400).json({ error: 'Aucun champ a mettre a jour' });
        }

        let password_hash;
        if (password) {
            password_hash = await hashPassword(password);
        }

        await userModel.updateUser(pool, {
            id: user.id,
            name,
            username,
            email,
            password_hash,
            // on ne permet PAS de changer le role via cette route
            role: undefined
        });

        return res.sendStatus(204);
    } catch (err) {
        console.error('updateSelfUser error:', err);
        return res.sendStatus(500);
    }
};
