// javascript
import { pool } from '../../database/database.js';
import { readClientByEmail } from '../../model/user.js';
import { verifyPassword } from '../../utils/password.js';

export const authBasic = (allowedRoles = []) => {
    return async (req, res, next) => {
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
            if (!user) {
                return res.status(401).send('Invalid credentials');
            }

            const ok = await verifyPassword(password, user.password_hash);
            if (!ok) {
                return res.status(401).send('Invalid credentials');
            }

            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                return res.status(403).send('Forbidden: role not allowed');
            }

            req.user = {
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
};
