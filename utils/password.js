import bcrypt from 'bcrypt';

const DEFAULT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

/**
 * Hash un mot de passe en clair avec bcrypt.
 * @param {string} plainPassword
 * @returns {Promise<string>} hash bcrypt
 */
export async function hashPassword(plainPassword) {
  if (typeof plainPassword !== 'string' || !plainPassword.trim()) {
    throw new Error('Mot de passe invalide pour le hashage');
  }
  return bcrypt.hash(plainPassword, DEFAULT_SALT_ROUNDS);
}

/**
 * Vérifie qu'un mot de passe en clair correspond au hash stocké.
 * @param {string} plainPassword
 * @param {string} passwordHash
 * @returns {Promise<boolean>} true si correspond, sinon false
 */
export async function verifyPassword(plainPassword, passwordHash) {
  if (!plainPassword || !passwordHash) {
    return false;
  }
  return bcrypt.compare(plainPassword, passwordHash);
}

