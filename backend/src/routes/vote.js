import { Router } from 'express';
import { setVote, removeVote, countVote } from "../controler/vote.js";
import { validate } from "../../middleware/validation/validate.js";
import { setVoteSchema, removeVoteSchema } from "../../validation/voteSchemas.js";

const router = Router();

router.post("/", validate(setVoteSchema), setVote);
router.delete("/", validate(removeVoteSchema), removeVote);
router.get("/:report_id", countVote);

export default router;
