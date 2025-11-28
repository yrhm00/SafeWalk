/**
 * Middleware d'autorisation basé sur les rôles
 * Vérifie que l'utilisateur a l'un des rôles autorisés
 * Doit être utilisé après un middleware d'identification (checkBasic ou checkJWT)
 */
export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        // Vérifier que l'utilisateur est authentifié
        if (!req.session || !req.session.role) {
            return res.sendStatus(401);
        }

        // Vérifier que l'utilisateur a l'un des rôles autorisés
        if (allowedRoles.includes(req.session.role)) {
            next();
        } else {
            res.sendStatus(403);
        }
    };
};
