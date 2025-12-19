import vine from '@vinejs/vine';

export const createCommentSchema = vine.object({
  content: vine.string().trim().minLength(1).maxLength(500),
  report_id: vine.number(),
  user_id: vine.number(),
});

export const updateCommentSchema = vine.object({
  id: vine.number(),
  content: vine.string().trim().minLength(1).maxLength(500).optional(),
});

