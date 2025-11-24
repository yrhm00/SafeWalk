import { apiRequest } from './apiClient.js';

// Pour l'instant il n'y a pas de vrai endpoint /auth/login côté backend.
// On expose une fonction factice pour que LoginPage puisse l'appeler si besoin,
// mais on va surtout stocker les identifiants dans localStorage.

export async function fakeLogin({ email, password }) {
  // On pourrait tester un appel simple protégé ici, mais LoginPage va gérer les erreurs.
  return { email };
}
