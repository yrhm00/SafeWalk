import vine from '@vinejs/vine';
import { logError } from "../../utils/logger.js";

export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const output = await vine.validate({ schema, data: req.body });
            req.body = output;
            next();
        } catch (error) {
            if (error.messages) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: error.messages,
                });
            }
            logError(error);
            return res.status(400).json({ error: 'Validation failed' });
        }
    };
};
