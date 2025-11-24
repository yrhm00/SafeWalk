import vine from '@vinejs/vine';

// Création d’un report simple (POST /reports, /reports/with-vote)
export const createReportSchema = vine.object({
  title: vine.string().trim().minLength(3).maxLength(255),
  description: vine.string().trim().minLength(3),
  zone_id: vine.number(),
  report_type_id: vine.number(),
  user_id: vine.number(),
});

// Mise à jour d’un report (PATCH /reports)
export const updateReportSchema = vine.object({
  id: vine.number(), // obligatoire
  title: vine.string().trim().minLength(3).maxLength(255).optional(),
  description: vine.string().trim().minLength(3).optional(),
  zone_id: vine.number().optional(),
  report_type_id: vine.number().optional(),
  user_id: vine.number().optional(),
});
