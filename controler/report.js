import {pool} from "../database/database.js";
import * as reportModel from "../model/report.js";
import * as userModel from "../model/user.js";

export const getReport = async (req, res)=> {
    try {
        const report = await reportModel.list(pool, req.params);
        if (report) {
            res.json(report);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(500);
    }
};

export const addReport = async (req, res) => {
    try {
        const id = await reportModel.create(pool, req.body);
        res.status(201).json({id});
    } catch (err) {
        res.sendStatus(500);
    }
};

export const updateReport = async (req, res) => {
    try {
        await reportModel.update(pool, req.body);
        res.sendStatus(204);
    } catch (err) {
        res.sendStatus(500);
    }
};

export const deleteReport = async (req, res) => {
    try {
        await reportModel.remove(pool, req.params);
        res.sendStatus(204);
    } catch (err) {
        res.sendStatus(500);
    }
};