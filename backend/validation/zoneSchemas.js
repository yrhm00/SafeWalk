import vine from '@vinejs/vine';

// Création d’une zone (POST /zones)
export const createZoneSchema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(100),
  description: vine.string().trim().minLength(3).optional(),
});

// Mise à jour d’une zone (PATCH /zones)
export const updateZoneSchema = vine.object({
  id: vine.number(),
  name: vine.string().trim().minLength(2).maxLength(100).optional(),
  description: vine.string().trim().minLength(3).optional(),
});

