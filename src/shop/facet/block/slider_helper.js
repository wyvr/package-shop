export function get_values_from_products(list) {
    const products = {};
    let min = undefined;
    let max = undefined;
    if (!Array.isArray(list)) {
        return { values: [], min, max, products };
    }
    const values = list.map((entry) => {
        const value = parseFloat(entry.value);
        if (min != undefined) {
            min = Math.min(min, value);
        } else {
            min = value;
        }
        if (max != undefined) {
            max = Math.max(max, value);
        } else {
            max = value;
        }
        if (!products[value]) {
            products[value] = [];
        }
        products[value].push(...entry.skus);
        return value;
    });
    return { values, min, max, products };
}
