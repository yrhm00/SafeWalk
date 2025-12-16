import argon2 from "argon2";

// Le "Poivre" demandé par ton prof
// Note: Dans un vrai projet, ceci devrait être dans le .env, mais le labo demande de l'écrire en dur pour l'exercice.
const PEPPER = Buffer.from("cecinestpasunpepper");

/**
 * Hash un mot de passe avec Argon2id et un Pepper
 */
export async function hashPassword(plainPassword) {
  if (typeof plainPassword !== 'string' || !plainPassword.trim()) {
    throw new Error('Mot de passe invalide');
  }

  return await argon2.hash(plainPassword, {
    type: argon2.argon2id, // Le labo demande explicitement Argon2id
    secret: PEPPER         // On ajoute le poivre ici
  });
}

/**
 * Vérifie le mot de passe avec le Pepper
 */
export async function verifyPassword(hash, plainPassword) {
  if (!hash || !plainPassword) return false;

  // IMPORTANT : Il faut fournir le même secret (pepper) pour la vérification
  return await argon2.verify(hash, plainPassword, {
    secret: PEPPER
  });
}