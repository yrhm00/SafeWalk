import 'dotenv/config';
import jwt from "jsonwebtoken";

const EXPIRATION = "24h";

export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: EXPIRATION });
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
