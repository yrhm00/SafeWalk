import { Router } from 'express';
import {
    addZone,
    updateZone,
    getZone,
    deleteZone
} from "../controler/zone.js";
import { validate } from "../middleware/validation/validate.js";
import { createZoneSchema, updateZoneSchema } from "../validation/zoneSchemas.js";

const router = Router();

router.post("/", validate(createZoneSchema), addZone);
router.patch("/", validate(updateZoneSchema), updateZone);
router.get("/", getZone);
router.get("/:id", getZone);
router.delete("/:id", deleteZone);

export default router;
