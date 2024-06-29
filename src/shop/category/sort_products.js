import { get_attribute_value } from '@src/shop/core/attributes.js';

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
    // use final_price because price represents the base price
    if (sort_by === 'price') {
        sort_by = 'final_price';
    }

    const sorted = list.sort((a, b) => {
        const a_prop = get_attribute_value(a, sort_by);
        const b_prop = get_attribute_value(b, sort_by);
        if (a_prop > b_prop) return 1;
        if (a_prop < b_prop) return -1;
        return 0;
    });
    const sorted_products = asc ? sorted : sorted.reverse();

    return sorted_products;
}
