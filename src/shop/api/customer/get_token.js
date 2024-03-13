import { filled_string } from '@wyvr/generator/src/utils/validate.js';

/**
 * Removes the "bearer " prefix from the authorization header.
 * @param {string} authorization_header - The authorization header.
 * @returns {string|undefined} - The token without the "bearer " prefix, or undefined if the authorization header is not a filled string.
 */
export function get_token(authorization_header) {
    if (!filled_string(authorization_header)) {
        return undefined;
    }
    return authorization_header.replace(/^bearer /i, '');
}
