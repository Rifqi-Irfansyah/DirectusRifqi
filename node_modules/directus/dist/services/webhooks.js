"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const items_1 = require("./items");
const messenger_1 = require("../messenger");
class WebhooksService extends items_1.ItemsService {
    constructor(options) {
        super('directus_webhooks', options);
        this.messenger = (0, messenger_1.getMessenger)();
    }
    async createOne(data, opts) {
        const result = await super.createOne(data, opts);
        this.messenger.publish('webhooks', { type: 'reload' });
        return result;
    }
    async createMany(data, opts) {
        const result = await super.createMany(data, opts);
        this.messenger.publish('webhooks', { type: 'reload' });
        return result;
    }
    async updateMany(keys, data, opts) {
        const result = await super.updateMany(keys, data, opts);
        this.messenger.publish('webhooks', { type: 'reload' });
        return result;
    }
    async deleteMany(keys, opts) {
        const result = await super.deleteMany(keys, opts);
        this.messenger.publish('webhooks', { type: 'reload' });
        return result;
    }
}
exports.WebhooksService = WebhooksService;
