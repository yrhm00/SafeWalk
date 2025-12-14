import express from "express";
import * as controler from "../controler/user.js";
import { checkJWT } from "../../middleware/identification/jwt.js";
import { checkRole } from "../../middleware/autorisation/checkRole.js";

const router = express.Router();

// Routes publiques
router.post('/login', controler.login);
router.post('/register', controler.createUser);

// Routes protégées (utilisateur connecté)
router.get('/me', checkJWT, controler.getMyProfile);
router.patch('/me', checkJWT, controler.updateUser);

// Routes admin uniquement
router.get('/', checkJWT, checkRole(['admin']), controler.getAllUsers);
router.post('/', checkJWT, checkRole(['admin']), controler.createUser);

// router.get('/:id', checkJWT, checkRole(['admin']), controler.getUserById);

// MAUVAISE PRATIQUE - N'IMPORTE QUI peut voir les users
router.get('/:id', controler.getUserById);
router.delete('/:id', checkJWT, checkRole(['admin']), controler.deleteUser);

export default router;