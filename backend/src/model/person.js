import { readUserByEmail } from "./user.js";
import argon2 from "argon2";

/**
 * Authentifier une personne par email et mot de passe
 * Retourne les informations de l'utilisateur si authentifié
 */
export const readPerson = async (clientSQL, { email, password }) => {
    try {
        const user = await readUserByEmail(clientSQL, { email });

        if (!user) {
            return { id: null, role: null };
        }

        // Vérifier le mot de passe avec argon2
        const isPasswordValid = await argon2.verify(user.password_hash, password);

        if (isPasswordValid) {
            return {
                id: user.id,
                role: user.role
            };
        } else {
            return { id: null, role: null };
        }
    } catch (error) {
        console.error("Error in readPerson:", error);
        return { id: null, role: null };
    }
};
