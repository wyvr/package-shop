import { find_attribute_by_code } from "@src/shop/facet/facet_helper.js";

export function get_tags(filter, details) {
    if (!filter || typeof filter != 'object') {
        return [];
    }
    return Object.keys(filter)
        .filter((id) => filter[id] !== undefined)
        .map((id) => {
            const attribute = find_attribute_by_code(id);
            const name = __(attribute?.name ? attribute.name : 'facet.' + id);
            const data = { id, name, details: filter[id] };
            if (details[id]) {
                data.details = details[id];
            }
            return data;
        });
}
export function change_tags(data, filter_config) {
    if (data.removed === undefined) {
        return {};
    }
    // create new filter with the remaining configs
    const new_filter = {};
    data.list
        .map((entry) => entry.id)
        .filter((x) => x)
        .forEach((key) => {
            new_filter[key] = filter_config[key];
        });
    return new_filter;
}
