import vine from '@vinejs/vine';

/**
 * Schéma de validation pour la création d'un rapport
 */
export const createReportSchema = vine.object({
    type_id: vine.number().positive(),
    zone_id: vine.number().positive().optional().nullable(),
    title: vine.string().minLength(3).maxLength(140),
    description: vine.string().minLength(10),
    latitude: vine.number().min(-90).max(90),
    longitude: vine.number().min(-180).max(180),
    image_url: vine.string().url().optional().nullable(),
    severity: vine.enum(['low', 'medium', 'high']).optional()
});

/**
 * Schéma de validation pour la mise à jour d'un rapport
 */
export const updateReportSchema = vine.object({
    title: vine.string().minLength(3).maxLength(140).optional(),
    description: vine.string().minLength(10).optional(),
    status: vine.enum(['pending', 'validated', 'resolved']).optional(),
    severity: vine.enum(['low', 'medium', 'high']).optional(),
    type_id: vine.number().positive().optional(),
    zone_id: vine.number().positive().optional().nullable()
});

/**
 * Middleware de validation pour la création de rapport
 */
export const validateCreateReport = async (req, res, next) => {
    try {
        req.body = await vine.validate({ schema: createReportSchema, data: req.body });
        next();
    } catch (error) {
        res.status(400).json({ errors: error.messages });
    }
};

/**
 * Middleware de validation pour la mise à jour de rapport
 */
export const validateUpdateReport = async (req, res, next) => {
    try {
        req.body = await vine.validate({ schema: updateReportSchema, data: req.body });
        next();
    } catch (error) {
        res.status(400).json({ errors: error.messages });
    }
};
