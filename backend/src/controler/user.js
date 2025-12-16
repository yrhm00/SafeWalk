import { pool } from "../../database/database.js";
import * as userModel from "../model/user.js";
import * as personModel from "../model/person.js";
import argon2 from "argon2";
import { generateToken } from "../../utils/jwt.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Login - génère un JWT
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        const person = await personModel.readPerson(pool, { email, password });

        if (person.id && person.role) {
            // 1. On utilise la fonction utilitaire (comme le prof)
            const token = generateToken({ id: person.id, role: person.role });

            // 2. Status 201 et renvoi du token (comme le prof) [cite: 2]
            res.status(201).send(token);
        } else {
            res.sendStatus(404); // Le prof renvoie 404 si user pas trouvé [cite: 2]
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

/**
 * Obtenir tous les utilisateurs (admin uniquement)
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.readAllUsers(pool);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * Obtenir un utilisateur par ID
 */
export const getUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.sendStatus(400);
        }

        const user = await userModel.readUserById(pool, id);
        if (user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * Créer un nouvel utilisateur (inscription)
 */
export const createUser = async (req, res) => {
    try {
        const { name, username, email, password, role } = req.body;

        // Hash du mot de passe avec argon2
        const password_hash = await argon2.hash(password);

        const newUser = await userModel.createUser(pool, {
            name,
            username,
            email,
            password_hash,
            role: role || 'citizen'
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        if (error.code === '23505') { // Violation de contrainte unique
            res.status(409).json({ error: "Email or username already exists" });
        } else {
            res.sendStatus(500);
        }
    }
};

/**
 * Mettre à jour l'utilisateur connecté
 */
export const updateUser = async (req, res) => {
    try {
        let updateData = { ...req.body };

        // Si un nouveau mot de passe est fourni, le hasher
        if (updateData.password) {
            updateData.password_hash = await argon2.hash(updateData.password);
            delete updateData.password;
        }

        const updatedUser = await userModel.updateUser(pool, req.session.id, updateData);

        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * Supprimer un utilisateur (admin uniquement)
 */
export const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.sendStatus(400);
        }

        const deleted = await userModel.deleteUser(pool, id);
        if (deleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

/**
 * Obtenir le profil de l'utilisateur connecté
 */
export const getMyProfile = async (req, res) => {
    try {
        const user = await userModel.readUserById(pool, req.session.id);
        if (user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};
