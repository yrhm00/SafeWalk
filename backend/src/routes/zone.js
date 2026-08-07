import express from "express";
import * as controler from "../controler/zone.js";
import { checkJWT } from "../../middleware/identification/jwt.js";
import { checkRole } from "../../middleware/autorisation/checkRole.js";
import { validate } from "../../middleware/validation/validate.js";
import { createZoneSchema, updateZoneSchema } from "../../validation/zoneSchemas.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Zone:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de la zone
 *         name:
 *           type: string
 *           description: Nom de la zone
 *         description:
 *           type: string
 *           description: Description de la zone
 *         geom:
 *           type: string
 *           description: Géométrie de la zone au format GeoJSON (sérialisée en chaîne)
 */

/**
 * @swagger
 * tags:
 *   name: Zones
 *   description: Gestion des zones géographiques
 */

/**
 * @swagger
 * /zones:
 *   get:
 *     summary: Récupérer toutes les zones
 *     tags: [Zones]
 *     security: []
 *     responses:
 *       200:
 *         description: Liste des zones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Zone'
 */
router.get('/', controler.getAllZones);

/**
 * @swagger
 * /zones/{id}:
 *   get:
 *     summary: Récupérer une zone par son ID
 *     tags: [Zones]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la zone
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Zone'
 *       404:
 *         description: Zone non trouvée
 */
router.get('/:id', controler.getZoneById);

/**
 * @swagger
 * /zones:
 *   post:
 *     summary: Créer une nouvelle zone (Admin)
 *     tags: [Zones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               geom:
 *                 type: string
 *     responses:
 *       201:
 *         description: Zone créée avec succès
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès interdit (Admin requis)
 */
router.post('/', checkJWT, checkRole(['admin']), validate(createZoneSchema), controler.createZone);

/**
 * @swagger
 * /zones/{id}:
 *   patch:
 *     summary: Mettre à jour une zone (Admin)
 *     tags: [Zones]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               geom:
 *                 type: string
 *     responses:
 *       200:
 *         description: Zone mise à jour
 *       403:
 *         description: Accès interdit (Admin requis)
 *       404:
 *         description: Zone non trouvée
 */
router.patch('/:id', checkJWT, checkRole(['admin']), validate(updateZoneSchema), controler.updateZone);

/**
 * @swagger
 * /zones/{id}:
 *   delete:
 *     summary: Supprimer une zone (Admin)
 *     tags: [Zones]
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
 *         description: Zone supprimée
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Zone non trouvée
 */
router.delete('/:id', checkJWT, checkRole(['admin']), controler.deleteZone);

export default router;
