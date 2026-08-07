export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.session || !req.session.role) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (allowedRoles.includes(req.session.role)) {
            next();
        } else {
            res.status(403).json({ error: "Accès interdit : Vous n'avez pas les droits nécessaires pour accéder à cette ressource." });
        }
    };
};
