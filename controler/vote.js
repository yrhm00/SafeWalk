import {pool} from "../database/database.js";
import * as voteModel from "../model/vote.js";

export const setVote = async (req, res) => {
    try {
        const row = await voteModel.setVote(pool, req.body);
        return res.status(200).json(row);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const removeVote = async (req, res) => {
    try {
        await voteModel.removeMyVote(pool, req.body);
        return res.sendStatus(204);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const countVote = async (req, res) => {
    try {
        const report_id = req.params.report_id;
        const counts = await voteModel.countByReport(pool, report_id);
        return res.json(counts);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

