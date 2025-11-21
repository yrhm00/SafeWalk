import express from "express";
import * as controler from "../controler/comment.js";
import { checkJWT } from "../../middleware/identification/jwt.js";

const router = express.Router();

// Routes publiques
router.get('/report/:reportId', controler.getCommentsByReport);

// Routes protégées (utilisateur connecté)
router.post('/', checkJWT, controler.createComment);
router.delete('/:id', checkJWT, controler.deleteComment);

export default router;