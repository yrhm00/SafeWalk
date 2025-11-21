import express from "express";
import * as controler from "../controler/report.js";
import { checkJWT } from "../../middleware/identification/jwt.js";
import { checkRole } from "../../middleware/autorisation/checkRole.js";

const router = express.Router();


// Routes publiques
router.get('/', controler.getAllReports);
router.get('/nearby', controler.searchReportsNearby); // IMPORTANT: avant /:id
router.get('/:id', controler.getReportById);

// Routes protégées (utilisateur connecté)
router.get('/user/me', checkJWT, controler.getMyReports);
router.post('/', checkJWT, controler.createReport);

// Routes admin ou propriétaire
router.patch('/:id', checkJWT, checkRole(['admin']), controler.updateReport);
router.delete('/:id', checkJWT, checkRole(['admin']), controler.deleteReport);

export default router;