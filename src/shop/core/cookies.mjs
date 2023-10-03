/**
 * Get all cookies from the document as an object where each key-value pair represents a single cookie.
 * @function get_cookies
 * @returns {Object} An object with each key-value pair representing a single cookie. If there are no cookies, an empty object is returned.
 */
export function get_cookies() {
    // check if cookies exist in the document. If not, return an empty object.
    if (!document?.cookie) {
        return {};
    }
    // split the document cookies string into an array by '; '
    const cookies = document.cookie.split('; ');

    // initialize an empty object to hold cookie key-value pairs
    const cookie_object = {};

    // loop through each item in the cookies array
    for (const cookie of cookies) {
        // split each cookie into its key and value parts
        const [key, value] = cookie.split('=');
        // add the key-value pair to the cookie_object
        cookie_object[key] = value;
    }
    // return the cookie_object containing all cookies as key-value pairs
    return cookie_object;
}

/**
 * Update or delete cookies based on provided data. Data should be an object where each key-value pair represents a single cookie.
 * Cookies corresponding to keys in the data object are updated with their respective values. Cookies with undefined values are deleted.
 * @function update_cookies
 * @param {Object} data The data to be used to update or delete cookies. Each key-value pair represents a single cookie.
 */
export function update_cookies(data) {
    // check if data is provided and it's an object type. If not, exit the function.
    if (!data || typeof data != 'object') {
        return;
    }

    // get current store key from stack and set path accordingly
    const path = `path=/${getStack('store')?.key ?? ''}`;

    // iterate over each entry in the provided data object
    Object.entries(data).forEach(([key, value]) => {
        // if value is undefined, delete the cookie
        if (value === undefined) {
            document.cookie = `${key}=; ${path}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
            return;
        }
        // else update or create a new cookie with the given key/value pair and path
        document.cookie = `${key}=${value}; ${path};`;
    });
}
