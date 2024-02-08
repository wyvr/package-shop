export function get_attribute_label_of_names(product, attribute_name) {
    return get_attribute_prop_of_names(product, attribute_name, 'label');
}
export function get_attribute_name_of_names(product, attribute_name) {
    return get_attribute_prop_of_names(product, attribute_name, 'name');
}
export function get_attribute_value_of_names(product, attribute_name) {
    return get_attribute_prop_of_names(product, attribute_name, 'value');
}
export function get_attribute_prop_of_names(product, attribute_name, prop) {
    if (!product || !attribute_name || !prop) {
        return undefined;
    }
    if (!Array.isArray(attribute_name)) {
        return get_attribute_prop(product, attribute_name, prop);
    }
    return attribute_name
        .map((n) => get_attribute_prop(product, n, prop))
        .filter((x) => x)
        .join(',');
}
export function get_attributes_of_names(product, attribute_name) {
    if (!product || !attribute_name) {
        return undefined;
    }
    if (!Array.isArray(attribute_name)) {
        return [get_attribute(product, attribute_name)].filter((x) => x);
    }
    return attribute_name.map((n) => get_attribute(product, n)).filter((x) => x);
}

export function get_attribute_label(product, attribute_name) {
    return get_attribute_prop(product, attribute_name, 'label');
}
export function get_attribute_name(product, attribute_name) {
    let name = get_attribute_prop(product, attribute_name, 'name');
    if (typeof name === 'object') {
        name = get_attribute_prop(product, attribute_name, 'value');
    }
    return name;
}
export function get_attribute_value(product, attribute_name) {
    return get_attribute_prop(product, attribute_name, 'value');
}
export function get_attribute_prop(product, attribute_name, prop) {
    const attr = get_attribute(product, attribute_name);
    if (!attr || !prop) {
        return undefined;
    }
    if (attr[prop]) {
        return attr[prop];
    }
    return attr;
}

export function get_attribute(product, attribute_name) {
    if (!product || !product[attribute_name]) {
        return undefined;
    }
    const attribute = product[attribute_name];
    if (attribute?.value && (!attribute.label || (typeof attribute.label === 'object' && Object.keys(attribute.label).length === 0))) {
        attribute.label = attribute_name;
    }
    return attribute;
}

/**
 * Filters the attributes of a given product based on specified attributes and denied attributes.
 *
 * @export
 * @param {object} product product object
 * @param {array} attributes Array of attribute names that are allowed in the final object. If it's not an array or contains '*', all attributes would be considered allowed.
 * @param {array} [denied_attributes] Array of attribute names that are disallowed in the final object. Any property with name in this array will definitely be removed from the final object even if it's included in the 'attributes' parameter.
 *
 * @returns {object|undefined} An product only containing the allowed properties
 *
 *       Note: If an attribute is listed in both `attributes` (allowed) and `denied_attributes`,
 *             it will be considered as disallowed.
 *
 * Usage:
 *       reduce_attributes({a: 1, b: 2}, ['a'], ['b']); // Returns: {a: 1}
 *       reduce_attributes({a: 1, b: 2}, ['*'], ['b']); // Returns: {a: 1}
 *       reduce_attributes({a: 1, b: 2}, ['a', 'b'], ['b']); // Returns: {a: 1}
 */
export function reduce_attributes(product, attributes, denied_attributes) {
    if (!product || typeof product !== 'object') {
        return undefined;
    }

    const p = {};
    const allow_all_attributes = !Array.isArray(attributes) || attributes.includes('*');
    let reduce = !allow_all_attributes;

    let check_denied = false;
    if (Array.isArray(denied_attributes)) {
        denied_attributes = new Set(denied_attributes);
        reduce = true;
        check_denied = true;
    }

    if (!reduce) {
        return product;
    }

    if (!allow_all_attributes) {
        attributes = new Set(attributes);
    }

    for (const [key, value] of Object.entries(product)) {
        if (check_denied && denied_attributes.has(key)) {
            continue;
        }
        if (allow_all_attributes || attributes.has(key)) {
            p[key] = value;
        }
    }

    return p;
}
