import { logError } from "../../utils/logger.js";

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        res.status(201).json({ url });
    } catch (error) {
        logError(error);
        res.sendStatus(500);
    }
};
