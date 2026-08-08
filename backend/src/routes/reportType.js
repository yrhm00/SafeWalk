import express from "express";
import * as controler from "../controler/reportType.js";
import { checkJWT } from "../../middleware/identification/jwt.js";
import { checkRole } from "../../middleware/autorisation/checkRole.js";
import { validate } from "../../middleware/validation/validate.js";
import { createReportTypeSchema, updateReportTypeSchema } from "../../validation/reportTypeSchemas.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ReportType:
 *       type: object
 *       required:
 *         - label
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique du type de signalement
 *         label:
 *           type: string
 *           description: Libellé du type de signalement
 */

/**
 * @swagger
 * tags:
 *   name: ReportTypes
 *   description: Gestion des types de signalement
 */

/**
 * @swagger
 * /report-types:
 *   get:
 *     summary: Récupérer tous les types de signalement
 *     tags: [ReportTypes]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche insensible à la casse dans le libellé
 *     responses:
 *       200:
 *         description: Liste paginée des types de signalement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ReportType'
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
router.get('/', controler.getAllReportTypes);

/**
 * @swagger
 * /report-types/{id}:
 *   get:
 *     summary: Récupérer un type de signalement par son ID
 *     tags: [ReportTypes]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails du type de signalement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportType'
 *       404:
 *         description: Type de signalement non trouvé
 */
router.get('/:id', controler.getReportTypeById);

/**
 * @swagger
 * /report-types:
 *   post:
 *     summary: Créer un nouveau type de signalement (Admin)
 *     tags: [ReportTypes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *             properties:
 *               label:
 *                 type: string
 *     responses:
 *       201:
 *         description: Type de signalement créé avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès interdit (Admin requis)
 *       409:
 *         description: Ce type de signalement existe déjà
 */
router.post('/', checkJWT, checkRole(['admin']), validate(createReportTypeSchema), controler.createReportType);

/**
 * @swagger
 * /report-types/{id}:
 *   patch:
 *     summary: Modifier un type de signalement (Admin)
 *     tags: [ReportTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *             properties:
 *               label:
 *                 type: string
 *     responses:
 *       200:
 *         description: Type de signalement mis à jour
 *       403:
 *         description: Accès interdit (Admin requis)
 *       404:
 *         description: Type de signalement non trouvé
 *       409:
 *         description: Ce type de signalement existe déjà
 */
router.patch('/:id', checkJWT, checkRole(['admin']), validate(updateReportTypeSchema), controler.updateReportType);

/**
 * @swagger
 * /report-types/{id}:
 *   delete:
 *     summary: Supprimer un type de signalement (Admin)
 *     tags: [ReportTypes]
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
 *         description: Type de signalement supprimé
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Type de signalement non trouvé
 */
router.delete('/:id', checkJWT, checkRole(['admin']), controler.deleteReportType);

export default router;
