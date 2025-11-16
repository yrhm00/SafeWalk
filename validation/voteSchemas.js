import vine from '@vinejs/vine';

// Création / mise à jour d’un vote (POST /votes)
export const setVoteSchema = vine.object({
  user_id: vine.number(),
  report_id: vine.number(),
  value: vine.enum([1, -1]),
});

// Suppression d’un vote (DELETE /votes)
export const removeVoteSchema = vine.object({
  user_id: vine.number(),
  report_id: vine.number(),
});

