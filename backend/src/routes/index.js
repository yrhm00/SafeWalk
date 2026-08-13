import { Router } from "express";
import userRoutes from "./user.js";
import reportRoutes from "./report.js";
import commentRoutes from "./comment.js";
import zoneRoutes from "./zone.js";
import voteRoutes from "./vote.js";
import reportTypeRoutes from "./reportType.js";
import uploadRoutes from "./upload.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/reports", reportRoutes);
router.use("/comments", commentRoutes);
router.use("/zones", zoneRoutes);
router.use("/votes", voteRoutes);
router.use("/report-types", reportTypeRoutes);
router.use("/uploads", uploadRoutes);

export default router;
