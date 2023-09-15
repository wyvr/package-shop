/**
 * @function sleep
 * @description Pauses execution of asynchronous functions for a specified duration.
 * @param {number} ms The number of milliseconds to sleep.
 * @returns {Promise} Returns a promise that resolves after the specified number of milliseconds.
 */
export async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * @function sleep_random
 * @description Pauses execution of asynchronous functions for a random duration within a specified range.
 * @param {number} min_ms The minimum number of milliseconds to sleep.
 * @param {number} max_ms The maximum number of milliseconds to sleep.
 * @returns {Promise} Returns a promise that resolves after a random duration between the minimum and maximum milliseconds provided.
 */
export async function sleep_random(min_ms, max_ms) {
    const random = Math.floor(Math.random() * (max_ms - min_ms)) + min_ms;
    return await sleep(random);
}
