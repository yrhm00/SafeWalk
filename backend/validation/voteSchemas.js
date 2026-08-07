import vine from '@vinejs/vine';

export const createVoteSchema = vine.object({
    report_id: vine.number().positive(),
    value: vine.boolean()
});

export const deleteVoteSchema = vine.object({
    report_id: vine.number().positive()
});
