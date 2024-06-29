import facets from '@src/shop/config/facets.js';

export function get_code_of_attribute(attribute) {
    if (Array.isArray(attribute.attribute)) {
        if (!attribute.as) {
            return undefined;
        }
        return attribute.as;
    }
    return attribute.attribute;
}
export function find_attribute_by_code(code) {
    return facets.attributes.find(
        (attribute) => attribute.as === code || attribute.attribute === code || (Array.isArray(attribute.attribute) && attribute.attribute.indexOf(code) > -1)
    );
}
export function get_data_of_attribute(config, code) {
    if (!code || !config) {
        return undefined;
    }
    return config[code];
}
