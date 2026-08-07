import { verifyToken } from '../../utils/jwt.js';

export const checkJWT = async (req, res, next) => {
    const authorize = req.get('authorization');
    if (authorize?.includes('Bearer')) {
        const jwtEncoded = authorize.split(' ')[1];
        try {
            req.session = verifyToken(jwtEncoded);
            next();
        } catch (e) {
            res.status(401).json({ error: e.message });
        }
    } else {
        res.status(401).json({ error: 'No jwt' });
    }
};
