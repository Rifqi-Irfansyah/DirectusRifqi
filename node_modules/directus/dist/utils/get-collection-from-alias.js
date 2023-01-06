"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollectionFromAlias = void 0;
/**
 * Extract the collection of an alias within an aliasMap
 * For example: 'ljnsv.name' -> 'authors'
 */
function getCollectionFromAlias(alias, aliasMap) {
    for (const aliasValue of Object.values(aliasMap)) {
        if (aliasValue.alias === alias) {
            return aliasValue.collection;
        }
    }
}
exports.getCollectionFromAlias = getCollectionFromAlias;
