import { pool } from "../../database/database.js";
import * as userModel from "../model/user.js";
import * as personModel from "../model/person.js";
import { hashPassword } from "../../utils/password.js";
import { generateToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import { logError } from "../../utils/logger.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const person = await personModel.readPerson(pool, { email, password });

        if (person.id && person.role) {
            const token = generateToken({ id: person.id, role: person.role });
            const refreshToken = generateRefreshToken({ id: person.id, role: person.role });

            res.status(201).json({
                token,
                refreshToken,
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
        logError(err);
        res.sendStatus(500);
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const payload = verifyRefreshToken(refreshToken);
        const token = generateToken({ id: payload.id, role: payload.role });

        res.status(201).json({ token });
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const search = req.query.search || '';

        const { users, total } = await userModel.readAllUsers(pool, limit, offset, search);

        res.json({
            data: users,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + users.length < total
            }
        });
    } catch (error) {
        logError(error);
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
        logError(error);
        res.sendStatus(500);
    }
};

export const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        const password_hash = await hashPassword(password);

        const newUser = await userModel.createUser(pool, {
            name,
            username,
            email,
            password_hash,
            role: 'citizen'
        });

        res.status(201).json(newUser);
    } catch (error) {
        logError(error);
        if (error.code === '23505') {
            res.status(409).json({ error: "Email or username already exists" });
        } else {
            res.sendStatus(500);
        }
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
        logError(error);
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
        logError(error);
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
        logError(error);
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
        logError(error);
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
        logError(error);
        res.sendStatus(500);
    }
};
