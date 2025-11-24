import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware d'identification JWT
 * Extrait le token du header Authorization: Bearer ...
 * Vérifie et décode le JWT
 * Ajoute req.session = {id, role} si valide
 */
export const checkJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.sendStatus(401);
    }

    try {
        // Extraire le token
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401);
        }

        // Vérifier et décoder le JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key_here");

        // Ajouter les informations de session
        req.session = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        // Token invalide ou expiré
        console.error("Error in checkJWT middleware:", error.message);
        res.sendStatus(401);
    }
};
