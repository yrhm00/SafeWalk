import { Router } from 'express';
import {
    addReportType,
    updateReportType,
    getReportType,
    deleteReportType
} from "../controler/reportType.js";

const router = Router();

router.post("/", addReportType);
router.patch("/", updateReportType);
router.get("/", getReportType);
router.get("/:id", getReportType);
router.delete("/:id", deleteReportType);

export default router;
