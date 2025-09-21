import { readableStreamLikeToAsyncGenerator } from '../../../observable/index.js';
import { scheduleAsyncIterable } from './scheduleAsyncIterable.js';
export function scheduleReadableStreamLike(input, scheduler) {
    return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
}
