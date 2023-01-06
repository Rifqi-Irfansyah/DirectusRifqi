"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLocations = void 0;
const utils_1 = require("@directus/shared/utils");
const env_1 = require("../env");
const get_config_from_env_1 = require("../utils/get-config-from-env");
const registerLocations = async (storage) => {
    const env = (0, env_1.getEnv)();
    const locations = (0, utils_1.toArray)(env.STORAGE_LOCATIONS);
    locations.forEach((location) => {
        location = location.trim();
        const driverConfig = (0, get_config_from_env_1.getConfigFromEnv)(`STORAGE_${location.toUpperCase()}_`);
        const { driver, ...options } = driverConfig;
        storage.registerLocation(location, { driver, options });
    });
};
exports.registerLocations = registerLocations;
