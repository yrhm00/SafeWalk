import { Router } from 'express';
import {
    addReport,
    updateReport,
    getReport,
    deleteReport,
    addReportWithVote,
} from "../controler/report.js";

const router = Router();

router.post("/", addReport);
router.post("/with-vote", addReportWithVote);
router.patch("/", updateReport);
router.get("/:id", getReport);
router.delete("/:id", deleteReport);

export default router;