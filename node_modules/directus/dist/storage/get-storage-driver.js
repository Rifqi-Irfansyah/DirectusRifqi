"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorageDriver = exports._aliasMap = void 0;
exports._aliasMap = {
    local: '@directus/storage-driver-local',
    s3: '@directus/storage-driver-s3',
    gcs: '@directus/storage-driver-gcs',
    azure: '@directus/storage-driver-azure',
    cloudinary: '@directus/storage-driver-cloudinary',
};
const getStorageDriver = async (driverName) => {
    if (driverName in exports._aliasMap) {
        driverName = exports._aliasMap[driverName];
    }
    else {
        throw new Error(`Driver "${driverName}" doesn't exist.`);
    }
    return (await import(driverName)).default;
};
exports.getStorageDriver = getStorageDriver;
