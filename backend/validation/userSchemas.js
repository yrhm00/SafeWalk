import vine from '@vinejs/vine';

export const loginSchema = vine.object({
    email: vine.string().trim().email(),
    password: vine.string()
});

export const refreshTokenSchema = vine.object({
    refreshToken: vine.string()
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
    password: vine.string().minLength(8).optional(),
    currentPassword: vine.string().optional()
});

export const updateUserByAdminSchema = vine.object({
    name: vine.string().trim().minLength(2).maxLength(120).optional(),
    username: vine.string().trim().minLength(3).maxLength(60).optional(),
    email: vine.string().trim().email().optional(),
    password: vine.string().minLength(8).optional(),
    role: vine.enum(['admin', 'citizen']).optional()
});
