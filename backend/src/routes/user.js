import express from "express";
import * as controler from "../controler/user.js";
import { checkJWT } from "../../middleware/identification/jwt.js";
import { checkRole } from "../../middleware/autorisation/checkRole.js";
import { validate } from "../../middleware/validation/validate.js";
import { loginSchema, registerSchema, createUserSchema, updateUserSchema } from "../../validation/userSchemas.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de l'utilisateur
 *         name:
 *           type: string
 *           description: Nom complet
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [citizen, admin]
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Se connecter (Obtenir un Token)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Connexion réussie (Token retourné)
 *       400:
 *         description: Identifiants manquants
 *       404:
 *         description: Utilisateur non trouvé ou mot de passe incorrect
 */
router.post('/login', validate(loginSchema), controler.login);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Inscription (Créer un compte)
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *       409:
 *         description: Email ou Username déjà utilisé
 */
router.post('/register', validate(registerSchema), controler.register);



/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Récupérer son propre profil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur récupéré
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/me', checkJWT, controler.getMyProfile);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Modifier son propre profil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour
 */
router.patch('/me', checkJWT, validate(updateUserSchema), controler.updateUser);



/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Accès interdit (Admin requis)
 */
router.get('/', checkJWT, checkRole(['admin']), controler.getAllUsers);

router.post('/', checkJWT, checkRole(['admin']), validate(createUserSchema), controler.createUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', checkJWT, checkRole(['admin']), controler.getUserById);

router.patch('/:id', checkJWT, checkRole(['admin']), validate(updateUserSchema), controler.updateUserById);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Utilisateur supprimé
 *       403:
 *         description: Accès interdit
 */
router.delete('/:id', checkJWT, checkRole(['admin']), controler.deleteUser);

export default router;