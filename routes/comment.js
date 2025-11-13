import { Router } from 'express';
import {
    addComment,
    updateComment,
    getComment, deleteComment
} from "../controler/comment.js";

const router = Router();

router.post("/", addComment);
router.patch("/", updateComment);
router.get("/:id", getComment);
router.delete("/:id", deleteComment);

export default router;