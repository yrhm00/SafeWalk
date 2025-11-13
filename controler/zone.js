import { pool } from "../database/database.js";
import * as zoneModel from "../model/zone.js";

// GET /zones  ou GET /zones/:id
export const getZone = async (req, res) => {
    try {
        if (req.params.id) {
            const zones = await zoneModel.list(pool);
            const zone = zones.find(z => String(z.id) === String(req.params.id));
            if (!zone) return res.sendStatus(404);
            return res.json(zone);
        }
        const zones = await zoneModel.list(pool);
        return res.json(zones);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

// POST /zones
export const addZone = async (req, res) => {
    try {
        const id = await zoneModel.create(pool, req.body);
        return res.status(201).json({ id });
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

// PATCH /zones  (body doit contenir id)
export const updateZone = async (req, res) => {
    try {
        await zoneModel.update(pool, req.body);
        return res.sendStatus(204);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

// DELETE /zones/:id
export const deleteZone = async (req, res) => {
    try {
        await zoneModel.remove(pool, req.params);
        return res.sendStatus(204);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};
