import {pool} from "../database/database.js";
import * as reportTypeModel from "../model/reportType.js";

export const getReportType = async (req, res) => {
    try {
        if (req.params && req.params.id) {
            const list = await reportTypeModel.list(pool);
            const item = list.find(t => String(t.id) === String(req.params.id));
            if (item) return res.json(item);
            return res.sendStatus(404);
        }
        const items = await reportTypeModel.list(pool);
        return res.json(items);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const addReportType = async (req, res) => {
    try {
        const result = await reportTypeModel.create(pool, req.body);
        return res.status(201).json(result);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const updateReportType = async (req, res) => {
    try {
        await reportTypeModel.update(pool, req.body);
        return res.sendStatus(204);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const deleteReportType = async (req, res) => {
    try {
        await reportTypeModel.remove(pool, req.params);
        return res.sendStatus(204);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

