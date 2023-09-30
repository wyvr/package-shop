import { writable } from 'svelte/store';
import { isServer } from '@wyvr/generator';
import { load, save } from './storage';
import { getSharedStore, setSharedStore } from './shared';

export const messages_name = 'messages';

/**
 * Creates a messaging object containing push, close, and subscribe methods.
 * If conditions are not met it returns null.
 *
 * @function 
 * @name createMessages
 * @returns {object|null} Returns an object with methods or null.
 *
 * @property {Function} push creates a new message
 *   @param {string} message The message content.
 *   @param {string} type The type of message.
 *   @param {object} [options={}] Optional settings for the message.
 * @return {integer} ID of the message
 *
 * @property {Function} close Destroy a specific message by ID.
 *   @param {string|number} id The ID of the message to remove.
 *
 * @property {Function} subscribe Svelte subsribe of the messages
 *   @param {Function} callback
 */
function createMessages() {
    // token is always null on server, no token available
    if (isServer) {
        return null;
    }
    let store = getSharedStore(messages_name);
    if (store) {
        return store;
    }
    // load token from storage
    const { subscribe, update } = writable([]);

    let id = 0;
    // create store logic
    store = {
        push: (message, type, options = {}) => {
            // force options
            if (['info', 'error', 'warning', 'success'].indexOf(type) == -1) {
                type = 'info';
            }
            const permanent = !!options.permanent;
            let destroy_in = new Date().getTime() + (options?.duration || 5) * 1000;
            if (permanent) {
                destroy_in = undefined;
            }
            id++;
            update((n) => [].concat(n, [{ message, type, destroy_in, id, permanent }]));
        },
        close: (id) => {
            update((n) => n.filter((entry) => entry.id != id));
        },
        subscribe,
    };

    setInterval(() => {
        const current = new Date().getTime();
        update((n) =>
            n.filter((entry) => {
                return !entry.destroy_in || entry.destroy_in >= current;
            })
        );
    }, 1000);

    return setSharedStore(messages_name, store);
}

export const messages = createMessages();
