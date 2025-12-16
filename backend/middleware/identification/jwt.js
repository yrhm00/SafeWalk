import { verifyToken } from '../../utils/jwt.js'; // Import de ton utilitaire

export const checkJWT = async (req, res, next) => {
    const authorize = req.get('authorization');
    if (authorize?.includes('Bearer')) { // 
        const jwtEncoded = authorize.split(' ')[1];
        try {
            // Utilisation de l'utilitaire encapsulé
            req.session = verifyToken(jwtEncoded); // 
            next();
        } catch (e) {
            res.status(401).send(e.message);
        }
    } else {
        res.status(401).send('No jwt');
    }
};