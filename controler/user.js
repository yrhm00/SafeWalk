import {pool} from "../database/database.js";
import * as userModel from "../model/user.js";

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
        const id = await userModel.createUser(pool, req.body);
        res.status(201).json({id});
    } catch (err) {
        res.sendStatus(500);
    }
};
export const updateUser = async (req, res) => {
    try {
        await userModel.updateUser(pool, req.body);
        res.sendStatus(204);
    } catch (err) {
        res.sendStatus(500);
    }
};
export const deleteUser = async (req, res) => {
    try {
        await userModel.deleteUser(pool, req.params);
        res.sendStatus(204);
    } catch (err) {
        res.sendStatus(500);
    }
};