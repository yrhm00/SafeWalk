import { appendFileSync, existsSync, mkdirSync, createWriteStream } from "node:fs";
import { join } from "node:path";

const logDirectory = join(process.cwd(), "logs");

if (!existsSync(logDirectory)) {
    mkdirSync(logDirectory);
}

export const accessLogStream = createWriteStream(join(logDirectory, "access.log"), { flags: "a" });

export const logError = (error) => {
    const timestamp = new Date().toISOString();
    const message = error instanceof Error ? error.stack : String(error);
    const line = `[${timestamp}] ${message}\n`;
    appendFileSync(join(logDirectory, "error.log"), line);
    console.error(line);
};
