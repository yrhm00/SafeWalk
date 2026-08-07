import argon2 from "argon2";

const PEPPER = Buffer.from(process.env.PEPPER);

export const hashPassword = async (plainPassword) => {
    return await argon2.hash(plainPassword, {
        type: argon2.argon2id,
        secret: PEPPER
    });
};

export const verifyPassword = async (hash, plainPassword) => {
    if (!hash) return false;
    return await argon2.verify(hash, plainPassword, {
        secret: PEPPER
    });
};
