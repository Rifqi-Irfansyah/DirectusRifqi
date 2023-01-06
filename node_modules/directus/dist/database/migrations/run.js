"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const lodash_1 = require("lodash");
const path_1 = __importDefault(require("path"));
const env_1 = __importDefault(require("../../env"));
const logger_1 = __importDefault(require("../../logger"));
const dynamic_import_1 = require("../../utils/dynamic-import");
// @ts-ignore
const format_title_1 = __importDefault(require("@directus/format-title"));
async function run(database, direction, log = true) {
    let migrationFiles = await fs_extra_1.default.readdir(__dirname);
    const customMigrationsPath = path_1.default.resolve(env_1.default.EXTENSIONS_PATH, 'migrations');
    let customMigrationFiles = ((await fs_extra_1.default.pathExists(customMigrationsPath)) && (await fs_extra_1.default.readdir(customMigrationsPath))) || [];
    migrationFiles = migrationFiles.filter((file) => /^[0-9]+[A-Z]-[^.]+\.(?:js|ts)$/.test(file));
    customMigrationFiles = customMigrationFiles.filter((file) => file.endsWith('.js'));
    const completedMigrations = await database.select('*').from('directus_migrations').orderBy('version');
    const migrations = [
        ...migrationFiles.map((path) => parseFilePath(path)),
        ...customMigrationFiles.map((path) => parseFilePath(path, true)),
    ].sort((a, b) => (a.version > b.version ? 1 : -1));
    const migrationKeys = new Set(migrations.map((m) => m.version));
    if (migrations.length > migrationKeys.size) {
        throw new Error('Migration keys collide! Please ensure that every migration uses a unique key.');
    }
    function parseFilePath(filePath, custom = false) {
        const version = filePath.split('-')[0];
        const name = (0, format_title_1.default)(filePath.split('-').slice(1).join('_').split('.')[0]);
        const completed = !!completedMigrations.find((migration) => migration.version === version);
        return {
            file: custom ? path_1.default.join(customMigrationsPath, filePath) : path_1.default.join(__dirname, filePath),
            version,
            name,
            completed,
        };
    }
    if (direction === 'up')
        await up();
    if (direction === 'down')
        await down();
    if (direction === 'latest')
        await latest();
    async function up() {
        const currentVersion = completedMigrations[completedMigrations.length - 1];
        let nextVersion;
        if (!currentVersion) {
            nextVersion = migrations[0];
        }
        else {
            nextVersion = migrations.find((migration) => {
                return migration.version > currentVersion.version && migration.completed === false;
            });
        }
        if (!nextVersion) {
            throw Error('Nothing to upgrade');
        }
        const { up } = await (0, dynamic_import_1.dynamicImport)(nextVersion.file);
        if (log) {
            logger_1.default.info(`Applying ${nextVersion.name}...`);
        }
        await up(database);
        await database.insert({ version: nextVersion.version, name: nextVersion.name }).into('directus_migrations');
    }
    async function down() {
        const lastAppliedMigration = (0, lodash_1.orderBy)(completedMigrations, ['timestamp', 'version'], ['desc', 'desc'])[0];
        if (!lastAppliedMigration) {
            throw Error('Nothing to downgrade');
        }
        const migration = migrations.find((migration) => migration.version === lastAppliedMigration.version);
        if (!migration) {
            throw new Error("Couldn't find migration");
        }
        const { down } = await (0, dynamic_import_1.dynamicImport)(migration.file);
        if (log) {
            logger_1.default.info(`Undoing ${migration.name}...`);
        }
        await down(database);
        await database('directus_migrations').delete().where({ version: migration.version });
    }
    async function latest() {
        for (const migration of migrations) {
            if (migration.completed === false) {
                const { up } = await (0, dynamic_import_1.dynamicImport)(migration.file);
                if (log) {
                    logger_1.default.info(`Applying ${migration.name}...`);
                }
                await up(database);
                await database.insert({ version: migration.version, name: migration.name }).into('directus_migrations');
            }
        }
    }
}
exports.default = run;
