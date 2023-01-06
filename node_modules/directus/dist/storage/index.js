"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorage = exports._cache = void 0;
const validate_env_1 = require("../utils/validate-env");
const register_drivers_1 = require("./register-drivers");
const register_locations_1 = require("./register-locations");
exports._cache = {
    storage: null,
};
const getStorage = async () => {
    if (exports._cache.storage)
        return exports._cache.storage;
    const { StorageManager } = await import('@directus/storage');
    (0, validate_env_1.validateEnv)(['STORAGE_LOCATIONS']);
    exports._cache.storage = new StorageManager();
    await (0, register_drivers_1.registerDrivers)(exports._cache.storage);
    await (0, register_locations_1.registerLocations)(exports._cache.storage);
    return exports._cache.storage;
};
exports.getStorage = getStorage;
