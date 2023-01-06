"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicImport = void 0;
const dynamicImport = async (mod) => {
    return process.env.VITEST ? await import(mod) : require(mod);
};
exports.dynamicImport = dynamicImport;
