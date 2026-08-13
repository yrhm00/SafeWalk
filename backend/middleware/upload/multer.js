import multer from "multer";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

export const uploadDirectory = join(process.cwd(), "uploads");

if (!existsSync(uploadDirectory)) {
    mkdirSync(uploadDirectory);
}

const allowedMimeTypes = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif"
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const extension = allowedMimeTypes[file.mimetype] || "jpg";
        cb(null, `${randomUUID()}.${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes[file.mimetype]) {
        cb(null, true);
    } else {
        cb(new Error("Only image files (jpeg, png, webp, gif) are allowed"), false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});
