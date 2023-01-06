import { BaseException } from '@directus/shared/exceptions';
import type { Range } from '@directus/storage';
export declare class RangeNotSatisfiableException extends BaseException {
    constructor(range?: Range);
}
