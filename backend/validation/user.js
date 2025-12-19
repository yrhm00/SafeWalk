import vine from '@vinejs/vine';

export const createUserSchema = vine.object({
    name: vine.string().minLength(2).maxLength(120),
    username: vine.string().minLength(3).maxLength(60).optional(),
    email: vine.string().email(),
    password: vine.string().minLength(6),
    role: vine.enum(['admin', 'citizen']).optional()
});

export const updateUserSchema = vine.object({
    name: vine.string().minLength(2).maxLength(120).optional(),
    username: vine.string().minLength(3).maxLength(60).optional(),
    email: vine.string().email().optional(),
    password: vine.string().minLength(6).optional()
});

export const loginSchema = vine.object({
    email: vine.string().email(),
    password: vine.string()
});
export const validateCreateUser = async (req, res, next) => {
    try {
        req.body = await vine.validate({ schema: createUserSchema, data: req.body });
        next();
    } catch (error) {
        res.status(400).json({ errors: error.messages });
    }
};

export const validateUpdateUser = async (req, res, next) => {
    try {
        req.body = await vine.validate({ schema: updateUserSchema, data: req.body });
        next();
    } catch (error) {
        res.status(400).json({ errors: error.messages });
    }
};

export const validateLogin = async (req, res, next) => {
    try {
        req.body = await vine.validate({ schema: loginSchema, data: req.body });
        next();
    } catch (error) {
        res.status(400).json({ errors: error.messages });
    }
};
