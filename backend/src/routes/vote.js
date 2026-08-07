import express from "express";
import * as controler from "../controler/vote.js";
import { checkJWT } from "../../middleware/identification/jwt.js";
import { validate } from "../../middleware/validation/validate.js";
import { createVoteSchema, deleteVoteSchema } from "../../validation/voteSchemas.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Vote:
 *       type: object
 *       required:
 *         - report_id
 *         - value
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique du vote
 *         report_id:
 *           type: integer
 *           description: ID du signalement concerné
 *         user_id:
 *           type: integer
 *           description: ID de l'utilisateur ayant voté
 *         value:
 *           type: boolean
 *           description: true pour un vote positif, false pour un vote négatif
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Votes
 *   description: Gestion des votes sur les signalements
 */

/**
 * @swagger
 * /votes/report/{reportId}:
 *   get:
 *     summary: Récupérer tous les votes d'un signalement, avec le résumé (upvotes/downvotes)
 *     tags: [Votes]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des votes et résumé
 *       400:
 *         description: ID invalide
 */
router.get('/report/:reportId', controler.getVotesByReport);

/**
 * @swagger
 * /votes/report/{reportId}/me:
 *   get:
 *     summary: Récupérer mon propre vote sur un signalement
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mon vote
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Aucun vote trouvé
 */
router.get('/report/:reportId/me', checkJWT, controler.getMyVote);

/**
 * @swagger
 * /votes:
 *   post:
 *     summary: Ajouter ou mettre à jour mon vote sur un signalement
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - report_id
 *               - value
 *             properties:
 *               report_id:
 *                 type: integer
 *               value:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Vote enregistré
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', checkJWT, validate(createVoteSchema), controler.addVote);

/**
 * @swagger
 * /votes:
 *   delete:
 *     summary: Retirer mon vote sur un signalement
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - report_id
 *             properties:
 *               report_id:
 *                 type: integer
 *     responses:
 *       204:
 *         description: Vote supprimé
 *       404:
 *         description: Aucun vote trouvé
 */
router.delete('/', checkJWT, validate(deleteVoteSchema), controler.removeVote);

export default router;
