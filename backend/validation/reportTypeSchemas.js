import vine from '@vinejs/vine';

export const createReportTypeSchema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(100),
  description: vine.string().trim().minLength(3).optional(),
});
export const updateReportTypeSchema = vine.object({
  id: vine.number(),
  name: vine.string().trim().minLength(2).maxLength(100).optional(),
  description: vine.string().trim().minLength(3).optional(),
});

