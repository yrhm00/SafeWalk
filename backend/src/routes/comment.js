import express from "express";
import * as controler from "../controler/comment.js";
import { checkJWT } from "../../middleware/identification/jwt.js";

const router = express.Router();


router.get('/report/:reportId', controler.getCommentsByReport);


router.post('/', checkJWT, controler.createComment);
router.patch('/:id', checkJWT, controler.updateComment);
router.delete('/:id', checkJWT, controler.deleteComment);

export default router;