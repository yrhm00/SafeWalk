import express from "express";
import * as controler from "../controler/report.js";
import { checkJWT } from "../../middleware/identification/jwt.js";
import { checkRole } from "../../middleware/autorisation/checkRole.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       required:
 *         - title
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
 *           enum: [open, validated, resolved, rejected]
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
 *     responses:
 *       200:
 *         description: Liste complète des signalements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
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
 *               - title
 *               - latitude
 *               - longitude
 *               - type_id
 *               - zone_id
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
router.post('/', checkJWT, controler.createReport);



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
 *               status:
 *                 type: string
 *                 enum: [validated, resolved, rejected]
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mis à jour avec succès
 *       403:
 *         description: Accès interdit (Admin requis)
 *       404:
 *         description: Signalement non trouvé
 */
router.patch('/:id', checkJWT, checkRole(['admin']), controler.updateReport);

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