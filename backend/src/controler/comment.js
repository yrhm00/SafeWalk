import { pool } from "../../database/database.js";
import * as commentModel from "../model/comment.js";

/**
 * Obtenir tous les commentaires d'un rapport
 */
export const getCommentsByReport = async (req, res) => {
    try {
        const report_id = parseInt(req.params.reportId);
        if (isNaN(report_id)) {
            return res.sendStatus(400);
        }

        const comments = await commentModel.readCommentsByReportId(pool, report_id);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * Créer un nouveau commentaire
 */
export const createComment = async (req, res) => {
    try {
        const { report_id, content } = req.body;

        const newComment = await commentModel.createComment(pool, {
            report_id,
            user_id: req.session.id,
            content
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * Mettre à jour un commentaire
 */
export const updateComment = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { content } = req.body;

        if (isNaN(id) || !content) {
            return res.sendStatus(400);
        }

        // Vérifier que le commentaire appartient à l'utilisateur ou que l'utilisateur est admin
        const comment = await commentModel.readCommentById(pool, id);

        if (!comment) {
            return res.sendStatus(404);
        }

        if (comment.user_id !== req.session.id && req.session.role !== 'admin') {
            return res.sendStatus(403);
        }

        const updatedComment = await commentModel.updateComment(pool, id, { content });
        res.json(updatedComment);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * Supprimer un commentaire
 */
export const deleteComment = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.sendStatus(400);
        }

        // Vérifier que le commentaire appartient à l'utilisateur ou que l'utilisateur est admin
        const comment = await commentModel.readCommentById(pool, id);

        if (!comment) {
            return res.sendStatus(404);
        }

        if (comment.user_id !== req.session.id && req.session.role !== 'admin') {
            return res.sendStatus(403);
        }

        const deleted = await commentModel.deleteComment(pool, id);
        if (deleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};
