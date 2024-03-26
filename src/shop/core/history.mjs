/**
 * Variable that is used to store the last URL that was added to history.
 * @type {string}
 */
let last_url;

/**
 * Function to add or modify history state. Uses the History API's pushState method to
 * create a new history entry. If the provided URL is the same as the last one processed,
 * no action is taken.
 *
 * @param {*} data The state object is a JavaScript object which is associated with the new history entry created by pushState(). This can be null.
 * @param {string} title The title for the new history entry. This can be null.
 * @param {string} [url=location.pathname] The URL for the new history entry. Defaults to the current page if not specified.
 * @returns {void}
 */
export function add_history(data = null, title = document.title, url = location.pathname) {
    if (last_url === url) {
        return;
    }
    last_url = url;
    history.pushState(data, title, url);
}

/**
 * Function to replace the current history state. Uses the History API's replaceState method to
 * replace the current history entry.
 *
 * @param {*} data The state object is a JavaScript object which is associated with the new history entry created by replaceState(). This can be null.
 * @param {string} title The title for the new history entry. This can be null.
 * @param {string} url The URL for the new history entry.
 * @returns {void}
 */
export function replace_history(data = null, title = document.title, url = location.pathname) {
    if (last_url === url) {
        return;
    }
    last_url = url;
    history.replaceState(data, title, url);
}

// global event handler
if (isClient) {
    window.addEventListener('popstate', (event) => {
        trigger('history', event);
    });
}
