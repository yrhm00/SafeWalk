import { pool } from "../../database/database.js";
import * as userModel from "../model/user.js";
import * as personModel from "../model/person.js";
import { hashPassword } from "../../utils/password.js";
import { generateToken } from "../../utils/jwt.js";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        const person = await personModel.readPerson(pool, { email, password });

        if (person.id && person.role) {
            const token = generateToken({ id: person.id, role: person.role });

            res.status(201).json({
                token,
                user: {
                    id: person.id,
                    username: person.username,
                    email: person.email,
                    role: person.role
                }
            });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.readAllUsers(pool);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

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

export const createUser = async (req, res) => {
    try {
        const { name, username, email, password, role } = req.body;

        const password_hash = await hashPassword(password);

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
        if (error.code === '23505') {
            res.status(409).json({ error: "Email or username already exists" });
        } else {
            res.sendStatus(500);
        }
    }
};

export const updateUser = async (req, res) => {
    try {
        let updateData = { ...req.body };

        if (updateData.password) {
            updateData.password_hash = await hashPassword(updateData.password);
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

export const updateUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.sendStatus(400);
        }

        let updateData = { ...req.body };

        if (updateData.password) {
            updateData.password_hash = await hashPassword(updateData.password);
            delete updateData.password;
        }

        const updatedUser = await userModel.updateUser(pool, id, updateData);

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
