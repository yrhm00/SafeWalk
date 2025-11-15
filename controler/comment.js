import {pool} from "../database/database.js";
import * as commentModel from "../model/comment.js";

export const getComment = async (req, res)=> {
    try {
        const comments = await commentModel.listForReport(pool, req.params);
        // listForReport renvoie toujours un tableau (eventuellement vide)
        // On renvoie 200 avec [] plutot que 404 si aucun commentaire
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const addComment = async (req, res) => {
    try {
        const id = await commentModel.createReport(pool, req.body);
        res.status(201).json({id});
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const deleteComment = async (req, res) => {
    try {
        if (!req.params || req.params.id == null) {
            return res.status(400).json({ error: 'id manquant pour la suppression du commentaire' });
        }
        await commentModel.removeReport(pool, req.params);
        res.sendStatus(204);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const updateComment = async (req, res) => {
    try {
        if (!req.body || req.body.id == null) {
            return res.status(400).json({ error: 'id manquant pour la mise à jour du commentaire' });
        }
        await commentModel.updateReport(pool, req.body);
        res.sendStatus(204);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};
