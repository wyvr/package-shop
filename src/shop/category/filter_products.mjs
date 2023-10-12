import { get_attribute_label, get_attribute_name, get_attribute_value } from '../core/attributes.mjs';
import facets from '@src/shop/config/facets.mjs';
import { get_code_of_attribute } from '@src/shop/facet/facet_helper.js';

/**
 * Filter the list of given products for the given filter config
 * @param {any[]} products 
 * @param {any} config 
 * @returns {any[]} products that match the given filter config
 */
export function filter(products, config) {
    if (!config) {
        return products;
    }
    // get attributes with value to filter for
    const keys = Object.keys(config).filter((x) => config[x] !== undefined);
    if (keys.length === 0) {
        return products;
    }

    // keys.push('category_ids');
    // config.category_ids = {
    //     "83": true
    // }
    // debugger;
    // build attributes object to filter
    const attributes = {};
    facets.attributes.forEach((attr) => {
        const code = get_code_of_attribute(attr);
        if (!code) {
            return;
        }
        attributes[code] = Object.assign({}, attr);
        // force array of attributes
        if (!Array.isArray(attr.attribute)) {
            attributes[code].attribute = [attributes[code].attribute];
        }
        // combine list of vlaues together
        if (attr.type == 'list') {
            attributes[code].values = config[code] ? Object.keys(config[code]) : [];
        }
    });
    // filter all products
    const filtered_products = products.filter((product) => {
        return keys.every((key) => {
            const attribute = attributes[key];
            // ignore wrong attributes
            if (!attribute) {
                return true;
            }

            const filter_value = config[key];

            // exit early for sliders
            if (attribute.type == 'slider' && filter_value.length < 2) {
                return false;
            }

            const values = get_values_of_attribute(product, attribute);
            // ignore products which does not contain the attribute
            if (values.length == 0) {
                return false;
            }
            let match = true;
            switch (attribute.type) {
                case 'bool':
                    if (filter_value === false && values.length == 0) {
                        return true;
                    }

                    match = values.find((value) => {
                        if (typeof value == 'string') {
                            return value === (filter_value ? '1' : '0');
                        }
                        return value === filter_value;
                    });
                    return match;
                case 'slider':
                    match = values.find((value) => value >= filter_value[0] && value <= filter_value[1]);
                    return match;
                case 'list':
                    match = attribute.values.find((value) => values.indexOf(value) > -1);
                    return match;
                case 'tree':
                    match = values.find((value) => filter_value[value]);
                    return match;
            }
            return true;
        });
    });
    return filtered_products;
}

function get_values_of_attribute(product, attribute) {
    const values = [];
    attribute.attribute.forEach((attribute_code) => {
        values.push(get_attribute_value(product, attribute_code));
        if (
            attribute.search_children &&
            Array.isArray(product.configurable_products) &&
            product.configurable_products.length > 0
        ) {
            values.push(...product.configurable_products.map((child) => get_attribute_value(child, attribute_code)));
        }
    });
    return values.filter(Boolean).reduce((values, current) => {
        if (typeof current == 'number') {
            values.push(current);
            return values;
        }
        // ignore unknown/unhandled types
        if(Array.isArray(current)) {
            values.push(...current)
            return values;
        }
        if (typeof current != 'string') {
            return values;
        }
        values.push(...current.split(',').filter(Boolean));
        return values;
    }, []);
}

export function get_filter_options(attributes, products) {
    const attrs = attributes.filter((item) => item.attribute);
    const child_attrs = attributes.filter((item) => item.search_children);
    const options = {};
    const hash = {};
    products.forEach((product) => {
        const sku = get_attribute_value(product, 'sku');
        attrs.forEach((item) => {
            process_attribute(item, sku, product, options, hash);
        });
        if (child_attrs.length > 0) {
            const children = product.configurable_products;
            if (children) {
                children.forEach((product) => {
                    child_attrs.forEach((item) => {
                        // sku gets used from the parent
                        process_attribute(item, sku, product, options, hash);
                    });
                });
            }
        }
    });

    // add the skus to the options
    Object.keys(options).forEach((attr) => {
        options[attr] = options[attr].map((item) => {
            item.skus = hash[attr][item.value];
            return item;
        });
    });
    return options;
}

function process_attribute(item, sku, product, options, hash) {
    const attr = item.attribute;
    if (Array.isArray(attr)) {
        if (!item.as) {
            return;
        }
        attr.forEach((attr_code) => {
            process_attribute_by_code(attr_code, item.as, sku, product, options, hash);
        });
        return;
    }
    process_attribute_by_code(attr, attr, sku, product, options, hash);
}

function process_attribute_by_code(product_attr_code, attr_code, sku, product, options, hash) {
    if (!product[product_attr_code] || product[product_attr_code] === '0') {
        return;
    }
    let label = get_attribute_label(product, product_attr_code);
    let name = get_attribute_name(product, product_attr_code);
    let value = get_attribute_value(product, product_attr_code);
    if (!options[attr_code]) {
        options[attr_code] = [];
        hash[attr_code] = {};
    }

    if (typeof name == 'object') {
        name = label;
    }
    if (!name || !value) {
        return;
    }
    if (typeof name !== 'string') {
        name = name + '';
    }
    if (typeof value !== 'string') {
        value = value + '';
    }

    // try split the value and name
    const splitted_name = name.split(',').map((x) => x.trim());
    const splitted_value = value.split(',').map((x) => x.trim());

    let entries = [];

    if (splitted_name.length == splitted_value.length) {
        entries = splitted_name
            .map((name, index) => {
                const value = splitted_value[index];
                if (!hash[attr_code][value]) {
                    hash[attr_code][value] = [sku];
                    return { key: name, value: splitted_value[index] };
                }
                hash[attr_code][value].push(sku);
                return undefined;
            })
            .filter((x) => x);
    } else {
        if (!hash[attr_code][value]) {
            entries.push({ key: name, value, skus: [sku] });
            hash[attr_code][value] = [sku];
        } else {
            hash[attr_code][value].push(sku);
        }
    }

    options[attr_code].push(...entries);
}
