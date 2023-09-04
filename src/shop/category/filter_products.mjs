import { get_attribute_label, get_attribute_name, get_attribute_value } from '../core/attributes.mjs';
import category_filter_attributes from '@src/shop/config/category_filter_attributes.mjs';

export function filter(products, config) {
    if (!config) {
        return products;
    }
    const keys = Object.keys(config).filter((x) => config[x] !== undefined);
    if (keys.length === 0) {
        return products;
    }
    const attributes = {};
    category_filter_attributes.attributes.forEach((attr) => {
        attributes[attr.attribute] = attr;
        if (attr.type == 'list') {
            attributes[attr.attribute].values = config[attr.attribute] ? Object.keys(config[attr.attribute]) : [];
        }
    });
    const filtered_products = products.filter((product) => {
        return keys.every((key) => {
            const attribute = attributes[key];
            // ignore wrong attributes
            if (!attribute) {
                return true;
            }
            const filter_value = config[key];
            let value = get_attribute_value(product, key);
            if (attribute.search_children && Array.isArray(product.configurable_products) && product.configurable_products.length > 0) {
                value = product.configurable_products.map((child) => get_attribute_value(child, key)).join(',');
            }

            const value_list = typeof value == 'string' ? value.split(',') : [];
            //console.log(value, filter_value, attribute);
            switch (attribute.type) {
                case 'bool':
                    // @TODO fix f**king json types
                    if (typeof value == 'string') {
                        return value === (filter_value ? '1' : '0');
                    }
                    if (filter_value === false && value === undefined) {
                        return true;
                    }
                    return value === filter_value;
                case 'slider':
                    if (filter_value.length < 2) {
                        return false;
                    }

                    return value >= filter_value[0] && value <= filter_value[1];
                case 'list':
                    return attribute.values.find((attr_value) => value_list.indexOf(attr_value) > -1);
            }
            return true;
        });
    });
    return filtered_products;
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
    // if() {

    // }
    return options;
}

function process_attribute(item, sku, product, options, hash) {
    const attr = item.attribute;
    if (!product[attr] || product[attr] === '0') {
        return;
    }
    let label = get_attribute_label(product, attr);
    let name = get_attribute_name(product, attr);
    let value = get_attribute_value(product, attr);
    if (!options[attr]) {
        options[attr] = [];
        hash[attr] = {};
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
                if (!hash[attr][value]) {
                    hash[attr][value] = [sku];
                    return { key: name, value: splitted_value[index] };
                }
                hash[attr][value].push(sku);
                return undefined;
            })
            .filter((x) => x);
    } else {
        if (!hash[attr][value]) {
            entries.push({ key: name, value, skus: [sku] });
            hash[attr][value] = [sku];
        } else {
            hash[attr][value].push(sku);
        }
    }

    options[attr].push(...entries);
}
