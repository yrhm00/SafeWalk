import { readUserByEmail } from "./user.js";
import { verifyPassword } from "../../utils/password.js";

export const readPerson = async (clientSQL, { email, password }) => {
    try {
        const user = await readUserByEmail(clientSQL, { email });

        if (!user) {
            return { id: null, role: null };
        }

        const isPasswordValid = await verifyPassword(user.password_hash, password);

        if (isPasswordValid) {
            return {
                id: user.id,
                role: user.role
            };
        } else {
            return { id: null, role: null };
        }
    } catch (error) {
        console.error("Error in readPerson:", error);
        return { id: null, role: null };
    }
};