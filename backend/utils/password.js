import argon2 from "argon2";

const PEPPER = Buffer.from("cecinestpasunpepper");

export async function hashPassword(plainPassword) {
  if (typeof plainPassword !== 'string' || !plainPassword.trim()) {
    throw new Error('Mot de passe invalide');
  }

  return await argon2.hash(plainPassword, {
    type: argon2.argon2id,
    secret: PEPPER
  });
}

export async function verifyPassword(hash, plainPassword) {
  if (!hash || !plainPassword) return false;
  return await argon2.verify(hash, plainPassword, {
    secret: PEPPER
  });
}