import { pool } from "../../database/database.js";
import * as reportModel from "../model/report.js";

/**
 * Obtenir tous les rapports
 */
export const getAllReports = async (req, res) => {
    try {
        const reports = await reportModel.readAllReports(pool);
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * Obtenir un rapport par ID
 */
export const getReportById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.sendStatus(400);
        }

        const report = await reportModel.readReportById(pool, id);
        if (report) {
            res.json(report);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * Créer un nouveau rapport
 */
export const createReport = async (req, res) => {
    try {
        const { type_id, zone_id, title, description, latitude, longitude, image_url, severity } = req.body;

        const newReport = await reportModel.createReport(pool, {
            user_id: req.session.id,
            type_id,
            zone_id,
            title,
            description,
            latitude,
            longitude,
            image_url,
            severity
        });

        res.status(201).json(newReport);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * Mettre à jour un rapport
 */
export const updateReport = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.sendStatus(400);
        }

        const updatedReport = await reportModel.updateReport(pool, id, req.body);

        if (updatedReport) {
            res.json(updatedReport);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * Supprimer un rapport
 */
export const deleteReport = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.sendStatus(400);
        }

        const deleted = await reportModel.deleteReport(pool, id);
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
 * Obtenir les rapports de l'utilisateur connecté
 */
export const getMyReports = async (req, res) => {
    try {
        const reports = await reportModel.readReportsByUserId(pool, req.session.id);
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * Rechercher les rapports à proximité (dans un rayon donné)
 * Query params: ?latitude=50.845&longitude=4.355&radius=5000
 */
export const searchReportsNearby = async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        const radiusMeters = radius ? parseInt(radius) : 5000; // 5km par défaut

        if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            return res.status(400).json({ error: 'Invalid coordinates' });
        }

        const reports = await reportModel.searchReportsNearby(pool, {
            latitude: lat,
            longitude: lon,
            radiusMeters
        });

        res.json(reports);
    } catch (error) {
        console.error('Error searching nearby reports:', error);
        res.status(500).json({ error: 'Failed to search nearby reports' });
    }
};