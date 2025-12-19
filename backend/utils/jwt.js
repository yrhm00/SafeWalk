import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET || "TaCleSecreteJWT";
const EXPIRATION = "24h";

export function generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRATION });
}

export function verifyToken(token) {
    return jwt.verify(token, SECRET);
}