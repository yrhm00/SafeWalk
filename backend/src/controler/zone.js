import { pool } from "../../database/database.js";
import * as zoneModel from "../model/zone.js";
import { logError } from "../../utils/logger.js";

export const getAllZones = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const search = req.query.search || '';

        const { zones, total } = await zoneModel.readAllZones(pool, limit, offset, search);

        res.json({
            data: zones,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + zones.length < total
            }
        });
    } catch (error) {
        logError(error);
        res.sendStatus(500);
    }
};

export const getZoneById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.sendStatus(400);
        }

        const zone = await zoneModel.readZoneById(pool, id);
        if (zone) {
            res.json(zone);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        logError(error);
        res.sendStatus(500);
    }
};

export const createZone = async (req, res) => {
    try {
        const { name, description, geom } = req.body;

        const newZone = await zoneModel.createZone(pool, {
            name,
            description,
            geom
        });

        res.status(201).json(newZone);
    } catch (error) {
        logError(error);
        res.sendStatus(500);
    }
};

export const updateZone = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.sendStatus(400);
        }

        const updatedZone = await zoneModel.updateZone(pool, id, req.body);

        if (updatedZone) {
            res.json(updatedZone);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        logError(error);
        res.sendStatus(500);
    }
};

export const deleteZone = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.sendStatus(400);
        }

        const deleted = await zoneModel.deleteZone(pool, id);
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
