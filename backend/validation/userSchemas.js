import vine from '@vinejs/vine';

// Schéma pour la création d'un utilisateur (POST /users)
export const createUserSchema = vine.object({
  name: vine.string().trim().optional(),
  username: vine.string().trim().minLength(3).maxLength(60),
  email: vine.string().trim().email(),
  // on attend un mot de passe en clair côté API, pas un hash
  password: vine.string().trim().minLength(3),
  role: vine.enum(['citizen', 'admin']).optional(),
});

// Schéma pour la mise à jour par un admin (PATCH /users)
export const updateUserSchema = vine.object({
  id: vine.number(), // id obligatoire
  name: vine.string().trim().optional(),
  username: vine.string().trim().minLength(3).maxLength(60).optional(),
  email: vine.string().trim().email().optional(),
  // mot de passe en clair optionnel, si présent on le re-hash
  password: vine.string().trim().minLength(3).optional(),
  role: vine.enum(['citizen', 'admin']).optional(),
});

// Schéma pour la mise à jour de soi-même (PATCH /users/me)
export const updateSelfUserSchema = vine.object({
  name: vine.string().trim().optional(),
  username: vine.string().trim().minLength(3).maxLength(60).optional(),
  email: vine.string().trim().email().optional(),
  // mot de passe en clair optionnel pour changer son propre mdp
  password: vine.string().trim().minLength(3).optional(),
});
