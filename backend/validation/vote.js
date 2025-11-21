import vine from '@vinejs/vine';

/**
 * Schéma de validation pour la création d'un vote
 */
export const createVoteSchema = vine.object({
    report_id: vine.number().positive(),
    value: vine.boolean()
});

/**
 * Schéma de validation pour la suppression d'un vote
 */
export const deleteVoteSchema = vine.object({
    report_id: vine.number().positive()
});

/**
 * Middleware de validation pour la création de vote
 */
export const validateCreateVote = async (req, res, next) => {
    try {
        req.body = await vine.validate({ schema: createVoteSchema, data: req.body });
        next();
    } catch (error) {
        res.status(400).json({ errors: error.messages });
    }
};

/**
 * Middleware de validation pour la suppression de vote
 */
export const validateDeleteVote = async (req, res, next) => {
    try {
        req.body = await vine.validate({ schema: deleteVoteSchema, data: req.body });
        next();
    } catch (error) {
        res.status(400).json({ errors: error.messages });
    }
};
