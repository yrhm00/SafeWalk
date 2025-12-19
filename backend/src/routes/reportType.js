import express from "express";
import * as controler from "../controler/reportType.js";
import { checkJWT } from "../../middleware/identification/jwt.js";
import { checkRole } from "../../middleware/autorisation/checkRole.js";

const router = express.Router();


router.get('/', controler.getAllReportTypes);
router.get('/:id', controler.getReportTypeById);


router.post('/', checkJWT, checkRole(['admin']), controler.createReportType);
router.patch('/:id', checkJWT, checkRole(['admin']), controler.updateReportType);
router.delete('/:id', checkJWT, checkRole(['admin']), controler.deleteReportType);

export default router;
