import { find_attribute_by_code } from '@src/shop/facet/facet_helper.js';

export function get_tags(filter, details) {
    if (!filter || typeof filter !== 'object') {
        return [];
    }
    const tags = [];
    for (const id in filter) {
        if (filter[id] === undefined || ['p'].indexOf(id) > -1) {
            continue;
        }
        const attribute = find_attribute_by_code(id);
        if (!attribute) {
            continue;
        }
        const name = __(attribute?.name ? attribute.name : `facet.${id}`);
        const data = { id, name, details: filter[id] };
        if (attribute.type === 'slider') {
            data.name = __('filter.range_name', {
                name,
                from: filter[id][0],
                to: filter[id][1],
                unit: attribute.unit || ''
            });
            data.details = undefined;
            tags.push(data);
            continue;
        }
        if (details[id]) {
            data.details = details[id];
        }
        tags.push(data);
    }
    return tags;
}
export function change_tags(data, filter_config) {
    if (data.removed === undefined) {
        return {};
    }
    // create new filter with the remaining configs
    const new_filter = {};
    for (const entry of data.list) {
        const key = entry.id;
        if (key) {
            new_filter[key] = filter_config[key];
        }
    }
    return new_filter;
}
