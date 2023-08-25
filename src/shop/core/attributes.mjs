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
    return get_attribute_prop(product, attribute_name, 'name');
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
    if (
        attribute &&
        attribute.value &&
        (!attribute.label || (typeof attribute.label == 'object' && Object.keys(attribute.label).length == 0))
    ) {
        attribute.label = attribute_name;
    }
    return attribute;
}

export function reduce_attributes(product, allowed_attributes = [], denied_attributes = []) {
    if (!product || typeof product != 'object') {
        return undefined;
    }
    const p = {};
    if (!Array.isArray(allowed_attributes) || allowed_attributes.indexOf('*') > -1) {
        allowed_attributes = [];
    }
    if (!Array.isArray(denied_attributes)) {
        denied_attributes = [];
    }
    Object.entries(product).forEach(([key, value]) => {
        if (denied_attributes.indexOf(key) > -1) {
            return;
        }
        if (allowed_attributes.length == 0 || allowed_attributes.indexOf(key) > -1) {
            p[key] = value;
        }
    });
    return p;
}
