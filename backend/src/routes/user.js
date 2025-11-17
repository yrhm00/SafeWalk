import { Router } from 'express';
import {
    addUser,
    updateUser,
    getUser, deleteUser,
    updateSelfUser,
    getUsers
} from "../controler/user.js";
import { authBasic } from "../../middleware/identification/basic.js";
import { validate } from "../../middleware/validation/validate.js";
import { createUserSchema, updateUserSchema, updateSelfUserSchema } from "../../validation/userSchemas.js";

const router = Router();

// Endpoint d'auto-identification : retourne l'utilisateur authentifié
router.get("/me", authBasic(['admin', 'citizen']), (req, res) => {
    const { password_hash, ...safeUser } = req.user || {};
    return res.json(safeUser);
});

// Creation d'un utilisateur avec validation Vine
router.post("/", validate(createUserSchema), addUser);

// Liste de tous les utilisateurs
router.get("/", getUsers);

// Exercice 1 du labo : mise a jour du citizen connecte via Basic Auth + validation Vine
router.patch("/me", authBasic(['citizen', 'admin']), validate(updateSelfUserSchema), updateSelfUser);

// Mise a jour par un admin (id dans le body) avec validation Vine
router.patch("/", validate(updateUserSchema), updateUser);

router.get("/:id", getUser);
router.delete("/:id", deleteUser);

export default router;