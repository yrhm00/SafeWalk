import { Router } from 'express';
import {
    addReport,
    updateReport,
    getReport,
    deleteReport,
    addReportWithVote,
} from "../controler/report.js";
import { validate } from "../middleware/validation/validate.js";
import { createReportSchema, updateReportSchema } from "../validation/reportSchemas.js";

const router = Router();

router.post("/", validate(createReportSchema), addReport);
router.post("/with-vote", validate(createReportSchema), addReportWithVote);
router.patch("/", validate(updateReportSchema), updateReport);
router.get("/:id", getReport);
router.delete("/:id", deleteReport);

export default router;