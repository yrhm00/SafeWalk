import { Router } from 'express';
import { setVote, removeVote, countVote } from "../controler/vote.js";

const router = Router();

router.post("/", setVote);
router.delete("/", removeVote);
router.get("/:report_id", countVote);

export default router;
