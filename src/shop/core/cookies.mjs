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

    // iterate over each entry in the provided data object
    Object.entries(data).forEach(([key, value]) => {
        update_cookie(key, value, { path, expires });
    });
}

/**
 * Updates a cookie with the specified key, value, and options.
 *
 * @param {string} key - The key of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {Object} options - The options for the cookie.
 * @param {string} options.path - The path for the cookie. Defaults to `/${getStack('store')?.key ?? ''}`.
 * @param {Date} options.expires - The expiration date for the cookie. Defaults to undefined.
 * @param {string} options.sameSite - The SameSite attribute for the cookie. Defaults to 'Strict'.
 * @param {boolean} options.secure - The secure attribute for the cookie. Defaults to true.
 * @param {boolean} options.httpOnly - The httpOnly attribute for the cookie. Defaults to false.
 */
export function update_cookie(key, value, options) {
    const defaults = {
        path: `/${getStack('store')?.key ?? ''}`,
        expires: undefined,
        sameSite: 'Strict',
        secure: true,
        httpOnly: false,
    };
    const opts = { ...defaults, ...options };
    // allow deleting of cookies by setting the value to undefined
    if (value === undefined) {
        opts.expires = 'Thu, 01 Jan 1970 00:00:01 GMT';
    }
    const cookie = [`${key}=${value}`];
    ['path', 'expires', 'sameSite', 'secure', 'httpOnly'].forEach((opt) => {
        const key = opt[0].toUpperCase() + opt.slice(1);
        if (opts[opt] !== undefined) {
            // handle boolean options
            if (opt == 'secure' || opt == 'httpOnly') {
                if (opts[opt] === true) {
                    cookie.push(key);
                }
                return;
            }
            cookie.push(key + '=' + opts[opt]);
        }
    });
    document.cookie = cookie.join('; ') + ';'; //`${key}=${value}; ${exp}${cookie_path};`;
}
