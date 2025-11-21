import express from "express";
import * as controler from "../controler/vote.js";
import { checkJWT } from "../../middleware/identification/jwt.js";

const router = express.Router();

// Routes publiques
router.get('/report/:reportId', controler.getVotesByReport);

// Routes protégées (utilisateur connecté)
router.get('/report/:reportId/me', checkJWT, controler.getMyVote);
router.post('/', checkJWT, controler.addVote);
router.delete('/', checkJWT, controler.removeVote);

export default router;
