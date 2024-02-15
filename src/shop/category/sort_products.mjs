import { get_attribute_value } from '../core/attributes.mjs';

/**
 *
 * @param {Object[]} products
 * @param {string} sort_by
 * @param {boolean} [asc=false]
 * @returns
 */
export function sort(products, sort_by, asc = false) {
    if (!products) {
        return [];
    }
    const list = [].concat(products);
    if (sort_by === 'position') {
        if (asc) {
            return list;
        }
        return list.reverse();
    }

    const sorted = list.sort((a, b) => {
        const a_prop = get_attribute_value(a, sort_by);
        const b_prop = get_attribute_value(b, sort_by);
        if (a_prop > b_prop) return 1;
        if (a_prop < b_prop) return -1;
        return 0;
    });
    if (asc) {
        return sorted;
    }
    return sorted.reverse();
}
