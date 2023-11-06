import { find_attribute_by_code } from '@src/shop/facet/facet_helper.js';

export function get_tags(filter, details) {
  if (!filter || typeof filter != 'object') {
    return [];
  }
  return Object.keys(filter)
    .filter((id) => filter[id] !== undefined)
    .map((id) => {
      if (['p'].indexOf(id) > -1) {
        return undefined;
      }
      const attribute = find_attribute_by_code(id);
      if (!attribute) {
        return undefined;
      }
      let name = __(attribute?.name ? attribute.name : 'facet.' + id);
      const data = { id, name, details: filter[id] };
      if (attribute.type == 'slider') {
        data.name = __('filter.range_name', {
          name,
          from: filter[id][0],
          to: filter[id][1],
          unit: attribute.unit || '',
        });
        data.details = undefined;
        return data;
      }
      if (details[id]) {
        data.details = details[id];
      }
      return data;
    })
    .filter(Boolean);
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
