import vine from '@vinejs/vine';

/**
 * Schéma de validation pour la création d'un commentaire
 */
export const createCommentSchema = vine.object({
    report_id: vine.number().positive(),
    content: vine.string().minLength(1).maxLength(1000)
});

/**
 * Middleware de validation pour la création de commentaire
 */
export const validateCreateComment = async (req, res, next) => {
    try {
        req.body = await vine.validate({ schema: createCommentSchema, data: req.body });
        next();
    } catch (error) {
        res.status(400).json({ errors: error.messages });
    }
};
