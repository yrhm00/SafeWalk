import { Router } from 'express';
import {
    addComment,
    updateComment,
    getComment, deleteComment
} from "../controler/comment.js";
import { validate } from "../../middleware/validation/validate.js";
import { createCommentSchema, updateCommentSchema } from "../../validation/commentSchemas.js";

const router = Router();

router.post("/", validate(createCommentSchema), addComment);
router.patch("/", validate(updateCommentSchema), updateComment);
router.get("/:id", getComment);
router.delete("/:id", deleteComment);

export default router;