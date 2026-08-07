import express from "express";
import * as controler from "../controler/comment.js";
import { checkJWT } from "../../middleware/identification/jwt.js";
import { validate } from "../../middleware/validation/validate.js";
import { createCommentSchema, updateCommentSchema } from "../../validation/commentSchemas.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - report_id
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique du commentaire
 *         report_id:
 *           type: integer
 *           description: ID du signalement concerné
 *         user_id:
 *           type: integer
 *           description: ID de l'auteur
 *         content:
 *           type: string
 *           description: Contenu du commentaire
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Gestion des commentaires sur les signalements
 */

/**
 * @swagger
 * /comments/report/{reportId}:
 *   get:
 *     summary: Récupérer les commentaires d'un signalement
 *     tags: [Comments]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des commentaires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: ID invalide
 */
router.get('/report/:reportId', controler.getCommentsByReport);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Ajouter un commentaire à un signalement
 *     tags: [Comments]
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
 *               - content
 *             properties:
 *               report_id:
 *                 type: integer
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Commentaire créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', checkJWT, validate(createCommentSchema), controler.createComment);

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Modifier son propre commentaire (ou tout commentaire si Admin)
 *     tags: [Comments]
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Commentaire mis à jour
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès interdit (pas l'auteur ni Admin)
 *       404:
 *         description: Commentaire non trouvé
 */
router.patch('/:id', checkJWT, validate(updateCommentSchema), controler.updateComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Supprimer son propre commentaire (ou tout commentaire si Admin)
 *     tags: [Comments]
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
 *         description: Commentaire supprimé
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Commentaire non trouvé
 */
router.delete('/:id', checkJWT, controler.deleteComment);

export default router;
