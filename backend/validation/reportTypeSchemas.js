import vine from '@vinejs/vine';

// Création d’un type de report (POST /report-types)
export const createReportTypeSchema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(100),
  description: vine.string().trim().minLength(3).optional(),
});

// Mise à jour d’un type de report (PATCH /report-types)
export const updateReportTypeSchema = vine.object({
  id: vine.number(),
  name: vine.string().trim().minLength(2).maxLength(100).optional(),
  description: vine.string().trim().minLength(3).optional(),
});

