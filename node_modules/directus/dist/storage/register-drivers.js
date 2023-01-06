"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDrivers = void 0;
const env_1 = require("../env");
const get_storage_driver_1 = require("./get-storage-driver");
const registerDrivers = async (storage) => {
    const env = (0, env_1.getEnv)();
    const usedDrivers = [];
    for (const [key, value] of Object.entries(env)) {
        if ((key.startsWith('STORAGE_') && key.endsWith('_DRIVER')) === false)
            continue;
        if (value && usedDrivers.includes(value) === false)
            usedDrivers.push(value);
    }
    for (const driverName of usedDrivers) {
        const storageDriver = await (0, get_storage_driver_1.getStorageDriver)(driverName);
        if (storageDriver) {
            storage.registerDriver(driverName, storageDriver);
        }
    }
};
exports.registerDrivers = registerDrivers;
