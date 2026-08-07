import vine from '@vinejs/vine';

export const createZoneSchema = vine.object({
    name: vine.string().trim().minLength(2).maxLength(100),
    description: vine.string().trim().minLength(3).optional(),
    geom: vine.string().optional()
});

export const updateZoneSchema = vine.object({
    name: vine.string().trim().minLength(2).maxLength(100).optional(),
    description: vine.string().trim().minLength(3).optional(),
    geom: vine.string().optional()
});
