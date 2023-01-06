"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function generateSecret() {
    const { nanoid } = await import('nanoid');
    process.stdout.write(nanoid(32));
    process.exit(0);
}
exports.default = generateSecret;
