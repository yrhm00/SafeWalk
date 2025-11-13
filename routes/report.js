import { Router } from 'express';
import {
    addReport,
    updateReport,
    getReport, deleteReport
} from "../controler/report.js";

const router = Router();

router.post("/", addReport);
router.patch("/", updateReport);
router.get("/:id", getReport);
router.delete("/:id", deleteReport);

export default router;