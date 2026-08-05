import vine from '@vinejs/vine';

export const loginSchema = vine.object({
    email: vine.string().trim().email(),
    password: vine.string()
});

export const registerSchema = vine.object({
    name: vine.string().trim().minLength(2).maxLength(120),
    username: vine.string().trim().minLength(3).maxLength(60).optional(),
    email: vine.string().trim().email(),
    password: vine.string().minLength(8)
});

export const createUserSchema = vine.object({
    name: vine.string().trim().minLength(2).maxLength(120),
    username: vine.string().trim().minLength(3).maxLength(60).optional(),
    email: vine.string().trim().email(),
    password: vine.string().minLength(8),
    role: vine.enum(['admin', 'citizen']).optional()
});

export const updateUserSchema = vine.object({
    name: vine.string().trim().minLength(2).maxLength(120).optional(),
    username: vine.string().trim().minLength(3).maxLength(60).optional(),
    email: vine.string().trim().email().optional(),
    password: vine.string().minLength(8).optional()
});
