import vine from '@vinejs/vine';

export const createVoteSchema = vine.object({
    report_id: vine.number().positive(),
    value: vine.boolean()
});

export const deleteVoteSchema = vine.object({
    report_id: vine.number().positive()
});

export const validateCreateVote = async (req, res, next) => {
    try {
        req.body = await vine.validate({ schema: createVoteSchema, data: req.body });
        next();
    } catch (error) {
        res.status(400).json({ errors: error.messages });
    }
};

export const validateDeleteVote = async (req, res, next) => {
    try {
        req.body = await vine.validate({ schema: deleteVoteSchema, data: req.body });
        next();
    } catch (error) {
        res.status(400).json({ errors: error.messages });
    }
};
