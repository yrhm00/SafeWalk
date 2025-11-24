import vine from '@vinejs/vine';

// Création d’un commentaire (POST /comments)
export const createCommentSchema = vine.object({
  content: vine.string().trim().minLength(1).maxLength(500),
  report_id: vine.number(),
  user_id: vine.number(),
});

// Mise à jour d’un commentaire (PATCH /comments)
export const updateCommentSchema = vine.object({
  id: vine.number(),
  content: vine.string().trim().minLength(1).maxLength(500).optional(),
});

