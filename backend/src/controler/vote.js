import { pool } from "../../database/database.js";
import * as voteModel from "../model/vote.js";
import { logError } from "../../utils/logger.js";

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
        logError(error);
        res.sendStatus(500);
    }
};

export const addVote = async (req, res) => {
    try {
        const { report_id, value } = req.body;

        const vote = await voteModel.createOrUpdateVote(pool, {
            report_id,
            user_id: req.session.id,
            value
        });

        res.status(201).json(vote);
    } catch (error) {
        logError(error);
        res.sendStatus(500);
    }
};

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
        logError(error);
        res.sendStatus(500);
    }
};

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
        logError(error);
        res.sendStatus(500);
    }
};
