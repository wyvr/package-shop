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
        // if there is no '=' in the cookie, it is a boolean cookie and we set its value to true
        const index = cookie.indexOf('=');
        if (index < 0) {
            cookie_object[cookie.trim()] = true;
            continue;
        }
        const key = cookie.slice(0, index).trim();
        const value = cookie.slice(index + 1).trim();
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
 * @param {String} path The path to be used for the cookie. If not provided, the path of the current store is used.
 * @param {String} expires The expiration date for the cookie. If not provided, the cookie will expire at the end of the session.
 */
export function update_cookies(data, path, expires = undefined) {
    // check if data is provided and it's an object type. If not, exit the function.
    if (!data || typeof data != 'object') {
        return;
    }

    let cookie_path = '';
    // get current store key from stack and set path accordingly
    if (!path) {
        cookie_path = `path=/${getStack('store')?.key ?? ''}`;
    } else {
        cookie_path = `path=${path}`;
    }

    // iterate over each entry in the provided data object
    Object.entries(data).forEach(([key, value]) => {
        // if value is undefined, delete the cookie
        if (value === undefined) {
            document.cookie = `${key}=; ${cookie_path}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
            return;
        }
        // else update or create a new cookie with the given key/value pair and path
        const exp = expires ? `expires=${expires}; ` : '';
        document.cookie = `${key}=${value}; ${exp}${cookie_path};`;
    });
}
