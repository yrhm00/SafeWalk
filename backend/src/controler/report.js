import { pool } from "../../database/database.js";
import * as reportModel from "../model/report.js";
import * as voteModel from "../model/vote.js";
import * as commentModel from "../model/comment.js";
import { logError } from "../../utils/logger.js";

export const getAllReports = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        const params = {};
        if (req.query.severity) params.severity = req.query.severity;
        if (req.query.days) params.days = parseInt(req.query.days);
        if (req.query.type_id) params.type_id = parseInt(req.query.type_id);

        const { reports, total } = await reportModel.readAllReports(pool, limit, offset, params);

        res.json({
            data: reports,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + reports.length < total
            }
        });
    } catch (error) {
        logError(error);
        res.sendStatus(500);
    }
};

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
        logError(error);
        res.sendStatus(500);
    }
};

export const createReport = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { type_id, zone_id, title, description, latitude, longitude, image_url, severity } = req.body;

        const newReport = await reportModel.createReport(client, {
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

        await voteModel.createOrUpdateVote(client, {
            report_id: newReport.id,
            user_id: req.session.id,
            value: true
        });

        await client.query('COMMIT');

        res.status(201).json(newReport);
    } catch (error) {
        await client.query('ROLLBACK');
        logError(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
};

export const updateReport = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.sendStatus(400);
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const updatedReport = await reportModel.updateReport(client, id, req.body);

        if (updatedReport) {
            if (req.body.status === 'validated' || req.body.status === 'resolved') {
                await commentModel.createComment(client, {
                    report_id: id,
                    user_id: req.session.id,
                    content: `Le statut du signalement est passé à : ${req.body.status.toUpperCase()} (Validation Admin).`
                });
            }

            await client.query('COMMIT');
            res.json(updatedReport);
        } else {
            await client.query('ROLLBACK');
            res.sendStatus(404);
        }
    } catch (error) {
        await client.query('ROLLBACK');
        logError(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
};

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
        logError(error);
        res.sendStatus(500);
    }
};

export const getMyReports = async (req, res) => {
    try {
        const reports = await reportModel.readReportsByUserId(pool, req.session.id);
        res.json(reports);
    } catch (error) {
        logError(error);
        res.sendStatus(500);
    }
};
