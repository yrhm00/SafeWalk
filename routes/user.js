import { Router } from 'express';
import {
    addUser,
    updateUser,
    getUser, deleteUser
} from "../controler/user.js";

const router = Router();

router.post("/", addUser);
router.patch("/", updateUser);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);

export default router;