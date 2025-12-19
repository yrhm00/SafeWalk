import vine from '@vinejs/vine';

export const createReportSchema = vine.object({
  title: vine.string().trim().minLength(3).maxLength(255),
  description: vine.string().trim().minLength(3),
  zone_id: vine.number(),
  report_type_id: vine.number(),
  user_id: vine.number(),
});

export const updateReportSchema = vine.object({
  id: vine.number(),
  title: vine.string().trim().minLength(3).maxLength(255).optional(),
  description: vine.string().trim().minLength(3).optional(),
  zone_id: vine.number().optional(),
  report_type_id: vine.number().optional(),
  user_id: vine.number().optional(),
});
