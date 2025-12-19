import vine from '@vinejs/vine';

export const setVoteSchema = vine.object({
  user_id: vine.number(),
  report_id: vine.number(),
  value: vine.enum([1, -1]),
});

export const removeVoteSchema = vine.object({
  user_id: vine.number(),
  report_id: vine.number(),
});

