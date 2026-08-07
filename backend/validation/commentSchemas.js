import vine from '@vinejs/vine';

export const createCommentSchema = vine.object({
    report_id: vine.number().positive(),
    content: vine.string().trim().minLength(1).maxLength(1000)
});

export const updateCommentSchema = vine.object({
    content: vine.string().trim().minLength(1).maxLength(1000)
});
