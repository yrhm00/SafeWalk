import express from "express";
import * as controler from "../controler/zone.js";
import { checkJWT } from "../../middleware/identification/jwt.js";
import { checkRole } from "../../middleware/autorisation/checkRole.js";

const router = express.Router();


router.get('/', controler.getAllZones);
router.get('/:id', controler.getZoneById);


router.post('/', checkJWT, checkRole(['admin']), controler.createZone);
router.patch('/:id', checkJWT, checkRole(['admin']), controler.updateZone);
router.delete('/:id', checkJWT, checkRole(['admin']), controler.deleteZone);

export default router;
