import vine from '@vinejs/vine';

export const createReportTypeSchema = vine.object({
    label: vine.string().trim().minLength(2).maxLength(80)
});

export const updateReportTypeSchema = vine.object({
    label: vine.string().trim().minLength(2).maxLength(80)
});
