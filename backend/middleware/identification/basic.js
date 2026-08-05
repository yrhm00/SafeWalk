import { pool } from "../../database/database.js";
import { readPerson } from "../../src/model/person.js";

export const checkBasic = async (req, res, next) => {
    const authHeader = req.get('authorization');

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'No basic authorization given' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [email, password] = credentials.split(':');

    if (!email || !password) {
        return res.status(401).json({ error: 'Invalid credentials format' });
    }

    const person = await readPerson(pool, { email, password });

    if (person.id && person.role) {
        req.session = {
            id: person.id,
            role: person.role
        };
        next();
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
};
