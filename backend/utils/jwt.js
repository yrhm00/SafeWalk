import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET || "TaCleSecreteJWT";
const EXPIRATION = "24h"; // ou '8h' comme dans la solution du prof

/**
 * Génère un token JWT (Utilisé dans le Login)
 */
export function generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRATION });
}

/**
 * Vérifie un token JWT (Utilisé dans le Middleware)
 */
export function verifyToken(token) {
    return jwt.verify(token, SECRET);
}