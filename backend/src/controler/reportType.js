import { pool } from "../../database/database.js";
import * as reportTypeModel from "../model/reportType.js";

/**
 * Obtenir tous les types de rapports
 */
export const getAllReportTypes = async (req, res) => {
    try {
        const reportTypes = await reportTypeModel.readAllReportTypes(pool);
        res.json(reportTypes);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * Obtenir un type de rapport par ID
 */
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
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * Créer un nouveau type de rapport (admin uniquement)
 */
export const createReportType = async (req, res) => {
    try {
        const { label } = req.body;

        const newReportType = await reportTypeModel.createReportType(pool, { label });

        res.status(201).json(newReportType);
    } catch (error) {
        console.error(error);
        if (error.code === '23505') { // Violation de contrainte unique
            res.status(409).json({ error: "Report type already exists" });
        } else {
            res.sendStatus(500);
        }
    }
};

/**
 * Mettre à jour un type de rapport (admin uniquement)
 */
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
        console.error(error);
        if (error.code === '23505') {
            res.status(409).json({ error: "Report type already exists" });
        } else {
            res.sendStatus(500);
        }
    }
};

/**
 * Supprimer un type de rapport (admin uniquement)
 */
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
        console.error(error);
        res.sendStatus(500);
    }
};
