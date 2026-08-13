import express from "express";
import * as controler from "../controler/upload.js";
import { checkJWT } from "../../middleware/identification/jwt.js";
import { upload } from "../../middleware/upload/multer.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: Téléversement d'images
 */

/**
 * @swagger
 * /uploads:
 *   post:
 *     summary: Téléverser une image (utilisée ensuite comme image_url d'un signalement)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image téléversée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *       400:
 *         description: Aucun fichier fourni, type de fichier invalide ou fichier trop volumineux (max 2 Mo)
 *       401:
 *         description: Non authentifié
 */
router.post('/', checkJWT, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, controler.uploadImage);

export default router;
