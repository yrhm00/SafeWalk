import { pool } from "../../database/database.js";
import * as voteModel from "../model/vote.js";

/**
 * Obtenir les votes d'un rapport avec résumé
 */
export const getVotesByReport = async (req, res) => {
    try {
        const report_id = parseInt(req.params.reportId);
        if (isNaN(report_id)) {
            return res.sendStatus(400);
        }

        const [votes, summary] = await Promise.all([
            voteModel.readVotesByReportId(pool, report_id),
            voteModel.getVoteSummary(pool, report_id)
        ]);

        res.json({
            votes,
            summary
        });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * Créer ou mettre à jour un vote
 */
export const addVote = async (req, res) => {
    try {
        const { report_id, value } = req.body;

        if (typeof value !== 'boolean') {
            return res.status(400).json({ error: "Value must be a boolean" });
        }

        const vote = await voteModel.createOrUpdateVote(pool, {
            report_id,
            user_id: req.session.id,
            value
        });

        res.status(201).json(vote);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * Supprimer un vote
 */
export const removeVote = async (req, res) => {
    try {
        const { report_id } = req.body;

        const deleted = await voteModel.deleteVote(pool, {
            report_id,
            user_id: req.session.id
        });

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

/**
 * Obtenir le vote de l'utilisateur connecté pour un rapport
 */
export const getMyVote = async (req, res) => {
    try {
        const report_id = parseInt(req.params.reportId);
        if (isNaN(report_id)) {
            return res.sendStatus(400);
        }

        const vote = await voteModel.getUserVote(pool, {
            report_id,
            user_id: req.session.id
        });

        if (vote) {
            res.json(vote);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};
