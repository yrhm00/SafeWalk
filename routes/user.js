import { Router } from 'express';
import {
    addUser,
    updateUser,
    getUser, deleteUser,
    updateSelfUser
} from "../controler/user.js";
import { authBasic } from "../middleware/identification/basic.js";

const router = Router();

router.post("/", addUser);

// Exercice 1 du labo : mise a jour du citizen connecte via Basic Auth
router.patch("/me", authBasic, updateSelfUser);

router.patch("/", updateUser);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);

export default router;