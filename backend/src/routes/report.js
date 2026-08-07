import express from "express";
import * as controler from "../controler/report.js";
import { checkJWT } from "../../middleware/identification/jwt.js";
import { checkRole } from "../../middleware/autorisation/checkRole.js";
import { validate } from "../../middleware/validation/validate.js";
import { createReportSchema, updateReportSchema } from "../../validation/reportSchemas.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       required:
 *         - type_id
 *         - title
 *         - description
 *         - latitude
 *         - longitude
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique du signalement
 *         title:
 *           type: string
 *           description: Titre du signalement
 *         description:
 *           type: string
 *           description: Détails supplémentaires
 *         latitude:
 *           type: number
 *           format: float
 *         longitude:
 *           type: number
 *           format: float
 *         status:
 *           type: string
 *           enum: [pending, validated, resolved]
 *           description: Statut actuel
 *         user_id:
 *           type: integer
 *           description: ID de l'auteur
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Gestion des signalements (Incidents)
 */



/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Récupérer tous les signalements
 *     tags: [Reports]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste paginée des signalements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     hasMore:
 *                       type: boolean
 */
router.get('/', controler.getAllReports);

/**
 * @swagger
 * /reports/{id}:
 *   get:
 *     summary: Récupérer un signalement par son ID
 *     tags: [Reports]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID du signalement
 *     responses:
 *       200:
 *         description: Détails du signalement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       404:
 *         description: Signalement non trouvé
 */
router.get('/:id', controler.getReportById);



/**
 * @swagger
 * /reports/user/me:
 *   get:
 *     summary: Récupérer mes propres signalements
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de mes signalements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 */
router.get('/user/me', checkJWT, controler.getMyReports);

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Créer un nouveau signalement
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type_id
 *               - title
 *               - description
 *               - latitude
 *               - longitude
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               image_url:
 *                 type: string
 *               type_id:
 *                 type: integer
 *               zone_id:
 *                 type: integer
 *               severity:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       201:
 *         description: Signalement créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', checkJWT, validate(createReportSchema), controler.createReport);



/**
 * @swagger
 * /reports/{id}:
 *   patch:
 *     summary: Mettre à jour un signalement (Admin)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, validated, resolved]
 *               severity:
 *                 type: string
 *                 enum: [low, medium, high]
 *               type_id:
 *                 type: integer
 *               zone_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Mis à jour avec succès
 *       403:
 *         description: Accès interdit (Admin requis)
 *       404:
 *         description: Signalement non trouvé
 */
router.patch('/:id', checkJWT, checkRole(['admin']), validate(updateReportSchema), controler.updateReport);

/**
 * @swagger
 * /reports/{id}:
 *   delete:
 *     summary: Supprimer un signalement (Admin)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Supprimé avec succès
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Signalement non trouvé
 */
router.delete('/:id', checkJWT, checkRole(['admin']), controler.deleteReport);

export default router;