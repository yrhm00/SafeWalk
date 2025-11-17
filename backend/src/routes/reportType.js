import { Router } from 'express';
import {
    addReportType,
    updateReportType,
    getReportType,
    deleteReportType
} from "../controler/reportType.js";
import { validate } from "../../middleware/validation/validate.js";
import { createReportTypeSchema, updateReportTypeSchema } from "../../validation/reportTypeSchemas.js";

const router = Router();

router.post("/", validate(createReportTypeSchema), addReportType);
router.patch("/", validate(updateReportTypeSchema), updateReportType);
router.get("/", getReportType);
router.get("/:id", getReportType);
router.delete("/:id", deleteReportType);

export default router;
