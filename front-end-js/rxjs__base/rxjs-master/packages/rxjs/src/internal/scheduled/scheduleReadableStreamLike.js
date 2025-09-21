import { readableStreamLikeToAsyncGenerator } from '@rxjs/observable';
import { scheduleAsyncIterable } from './scheduleAsyncIterable.js';
export function scheduleReadableStreamLike(input, scheduler) {
    return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
}
