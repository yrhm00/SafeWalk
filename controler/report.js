import {pool} from "../database/database.js";
import * as reportModel from "../model/report.js";
import { createReportWithInitialVote } from "../database/transaction.js";

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

// Méthode existante : crée un report simple via le modèle
export const addReport = async (req, res) => {
    try {
        const report = await reportModel.create(pool, req.body);
        if (!report) {
            return res.status(400).json({ error: "Création du report impossible" });
        }
        res.status(201).json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la création du report" });
    }
};

// Nouvelle méthode : crée un report + vote initial dans une transaction
export const addReportWithVote = async (req, res) => {
    try {
        // Remplacer par l'ID réel extrait du token/auth en production
        const userId = req.user?.id ?? 1;

        const newReport = await createReportWithInitialVote(pool, req.body, userId);
        res.status(201).json(newReport);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la création du report avec vote" });
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