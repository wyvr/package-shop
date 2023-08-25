import product_badge_attributes from "./product_badge_attributes.mjs";

export default [
    'store_id',
    'entity_id',
    'attribute_set_id',
    'type_id',
    'sku',
    'name',
    'thumbnail',
    'url_key',
    'price',
    'material',
    'style_general',
    'pattern',
    'climate',
    'final_price',
    'special_price',
    // required to show simples of configurables
    'configurable_products',
    // required to show stock and to show simples of configurables
    'stock',
    // required because of the configurable options
    'color',
    'size',
    'position',
    ...product_badge_attributes
];
