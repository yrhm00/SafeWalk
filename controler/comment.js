import {pool} from "../database/database.js";
import * as commentModel from "../model/comment.js";

export const getComment = async (req, res)=> {
    try {
        const user = await commentModel.listForReport(pool, req.params);
        if (user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(500);
    }
};

export const addComment = async (req, res) => {
    try {
        const id = await commentModel.createReport(pool, req.body);
        res.status(201).json({id});
    } catch (err) {
        res.sendStatus(500);
    }
};

export const deleteComment = async (req, res) => {
    try {
        await commentModel.removeReport(pool, req.params);
        res.sendStatus(204);
    } catch (err) {
        res.sendStatus(500);
    }
};

export const updateComment = async (req, res) => {
    try {
        await commentModel.updateReport(pool, req.body);
        res.sendStatus(204);
    } catch (err) {
        res.sendStatus(500);
    }
}