"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColumnPath = void 0;
const get_relation_info_1 = require("./get-relation-info");
const exceptions_1 = require("../exceptions");
/**
 * Converts a Directus field list path to the correct SQL names based on the constructed alias map.
 * For example: ['author', 'role', 'name'] -> 'ljnsv.name'
 * Also returns the target collection of the column: 'directus_roles'
 * If the last filter path is an alias field, a nested PK is appended to the path
 */
function getColumnPath({ path, collection, aliasMap, relations, schema }) {
    return followRelation(path);
    function followRelation(pathParts, parentCollection = collection, parentFields, addNestedPkField) {
        var _a, _b, _c, _d;
        /**
         * For A2M fields, the path can contain an optional collection scope <field>:<scope>
         */
        const pathRoot = pathParts[0].split(':')[0];
        const { relation, relationType } = (0, get_relation_info_1.getRelationInfo)(relations, parentCollection, pathRoot);
        if (!relation) {
            throw new exceptions_1.InvalidQueryException(`"${parentCollection}.${pathRoot}" is not a relational field`);
        }
        const alias = parentFields ? (_a = aliasMap[`${parentFields}.${pathParts[0]}`]) === null || _a === void 0 ? void 0 : _a.alias : (_b = aliasMap[pathParts[0]]) === null || _b === void 0 ? void 0 : _b.alias;
        const remainingParts = pathParts.slice(1);
        let parent;
        if (relationType === 'a2o') {
            const pathScope = pathParts[0].split(':')[1];
            if (!pathScope) {
                throw new exceptions_1.InvalidQueryException(`You have to provide a collection scope when sorting on a many-to-any item`);
            }
            parent = pathScope;
        }
        else if (relationType === 'm2o') {
            parent = relation.related_collection;
        }
        else {
            parent = relation.collection;
        }
        // Top level alias field
        if (schema && !(((_c = remainingParts[0]) !== null && _c !== void 0 ? _c : parent).includes('(') && ((_d = remainingParts[0]) !== null && _d !== void 0 ? _d : parent).includes(')'))) {
            if (remainingParts.length === 0) {
                remainingParts.push(schema.collections[parent].primary);
                addNestedPkField = schema.collections[parent].primary;
            }
            // Nested level alias field
            else if (remainingParts.length === 1 && schema.collections[parent].fields[remainingParts[0]].type === 'alias') {
                remainingParts.push(schema.collections[relation.related_collection].primary);
                addNestedPkField = schema.collections[relation.related_collection].primary;
            }
        }
        if (remainingParts.length === 1) {
            return {
                columnPath: `${alias || parent}.${remainingParts[0]}`,
                targetCollection: parent,
                addNestedPkField,
            };
        }
        if (remainingParts.length) {
            return followRelation(remainingParts, parent, `${parentFields ? parentFields + '.' : ''}${pathParts[0]}`, addNestedPkField);
        }
        return { columnPath: '', targetCollection: '', addNestedPkField };
    }
}
exports.getColumnPath = getColumnPath;
