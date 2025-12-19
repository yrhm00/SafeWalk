import vine from '@vinejs/vine';

export const createUserSchema = vine.object({
  name: vine.string().trim().optional(),
  username: vine.string().trim().minLength(3).maxLength(60),
  email: vine.string().trim().email(),
  password: vine.string().trim().minLength(3),
  role: vine.enum(['citizen', 'admin']).optional(),
});

export const updateUserSchema = vine.object({
  id: vine.number(),
  name: vine.string().trim().optional(),
  username: vine.string().trim().minLength(3).maxLength(60).optional(),
  email: vine.string().trim().email().optional(),
  password: vine.string().trim().minLength(3).optional(),
  role: vine.enum(['citizen', 'admin']).optional(),
});

export const updateSelfUserSchema = vine.object({
  name: vine.string().trim().optional(),
  username: vine.string().trim().minLength(3).maxLength(60).optional(),
  email: vine.string().trim().email().optional(),
  password: vine.string().trim().minLength(3).optional(),
});
