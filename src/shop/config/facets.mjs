export default {
    min_entries: 2,
    attributes: [
        { attribute: 'final_price', type: 'slider', name: 'facet.price' },
        { attribute: 'color', type: 'list', search_children: true, name: 'facet.color' },
        { attribute: 'size', type: 'list', search_children: true, name: 'facet.size' },
        { attribute: 'eco_collection', type: 'bool', name: 'facet.eco_collection' },
        { attribute: 'performance_fabric', type: 'bool', name: 'facet.performance_fabric' },
        { attribute: 'erin_recommends', type: 'bool', name: 'facet.erin_recommends' },
        { attribute: 'new', type: 'bool', name: 'facet.new' },
        { attribute: 'sale', type: 'bool', name: 'facet.sale' },
        { attribute: 'material', type: 'list', name: 'facet.material' },
        { attribute: 'style_general', type: 'list', name: 'facet.style' },
        { attribute: 'pattern', type: 'list', name: 'facet.pattern' },
        { attribute: 'climate', type: 'list', name: 'facet.climate' }
    ]
};
