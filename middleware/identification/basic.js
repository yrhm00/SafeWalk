import {pool} from '../../database/database.js';
import {readClientByEmail} from '../../model/user.js';

export const authBasic = async (req, res, next) => {
    try {
        const authorize = req.get('authorization');

        if (!authorize || !authorize.includes('Basic ')) {
            return res.status(401).send('No basic authorization given');
        }

        const basicEncoded = authorize.split(' ')[1];
        const authString = Buffer.from(basicEncoded, 'base64').toString('utf-8');
        const [email, password] = authString.split(':');

        if (!email || !password) {
            return res.status(401).send('Invalid basic authorization format');
        }

        const user = await readClientByEmail(pool, { email });

        // utilisateur introuvable
        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        // dans le contexte du labo, on compare simplement password avec password_hash
        if (user.password_hash !== password) {
            return res.status(401).send('Invalid credentials');
        }

        // on ne laisse passer que les citizens
        if (user.role !== 'citizen') {
            return res.status(403).send('Forbidden: not a citizen');
        }

        // on stocke le citizen authentifie pour les routes protegees
        req.citizen = {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        };

        next();
    } catch (err) {
        console.error('authBasic error:', err);
        res.sendStatus(500);
    }
};