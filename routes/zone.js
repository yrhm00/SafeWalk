import { Router } from 'express';
import {
    addZone,
    updateZone,
    getZone,
    deleteZone
} from "../controler/zone.js";

const router = Router();

router.post("/", addZone);
router.patch("/", updateZone);
router.get("/", getZone);
router.get("/:id", getZone);
router.delete("/:id", deleteZone);

export default router;
