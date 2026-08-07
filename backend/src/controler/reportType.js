import { pool } from "../../database/database.js";
import * as reportTypeModel from "../model/reportType.js";
import { logError } from "../../utils/logger.js";

export const getAllReportTypes = async (req, res) => {
    try {
        const reportTypes = await reportTypeModel.readAllReportTypes(pool);
        res.json(reportTypes);
    } catch (error) {
        logError(error);
        res.sendStatus(500);
    }
};

export const getReportTypeById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.sendStatus(400);
        }

        const reportType = await reportTypeModel.readReportTypeById(pool, id);
        if (reportType) {
            res.json(reportType);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        logError(error);
        res.sendStatus(500);
    }
};

export const createReportType = async (req, res) => {
    try {
        const { label } = req.body;

        const newReportType = await reportTypeModel.createReportType(pool, { label });

        res.status(201).json(newReportType);
    } catch (error) {
        logError(error);
        if (error.code === '23505') { // Violation de contrainte unique
            res.status(409).json({ error: "Report type already exists" });
        } else {
            res.sendStatus(500);
        }
    }
};

export const updateReportType = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.sendStatus(400);
        }

        const { label } = req.body;
        const updated = await reportTypeModel.updateReportType(pool, id, { label });

        if (updated) {
            res.json(updated);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        logError(error);
        if (error.code === '23505') {
            res.status(409).json({ error: "Report type already exists" });
        } else {
            res.sendStatus(500);
        }
    }
};

export const deleteReportType = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.sendStatus(400);
        }

        const deleted = await reportTypeModel.deleteReportType(pool, id);
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
