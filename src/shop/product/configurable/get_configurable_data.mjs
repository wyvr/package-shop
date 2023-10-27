import { get_attribute_value } from '@src/shop/core/attributes.mjs';
import { get_stock } from '@src/shop/core/product/get_stock.mjs';

export function get_configurable_data(configurable_options, configurable_products) {
    /*
    {
        "93": [
            {
                "sku": "MH02-XL-Black",
                "product_id": "78",
                "attribute_code": "color",
                "value_index": "49",
                "super_attribute_label": "Color",
                "default_title": "Black",
                "option_title": "Black"
            },
            {
                "sku": "MH02-M-Black",
                "product_id": "78",
                "attribute_code": "color",
                "value_index": "49",
                "super_attribute_label": "Color",
                "default_title": "Black",
                "option_title": "Black"
            }
        ]
    }
    */
    if (
        !configurable_options ||
        typeof configurable_options != 'object' ||
        Array.isArray(configurable_options) ||
        !Array.isArray(configurable_products)
    ) {
        return undefined;
    }

    const list = Object.values(configurable_options);
    // get full list of in_stock per sku
    const sku_stock = {};
    configurable_products.forEach((product) => {
        const stock = get_stock(product);
        sku_stock[product.sku.value] = !!(stock.qty > 0 && stock.is_in_stock);
    });

    // the configurable option attributes
    const attribute_options = {};
    list.forEach((options) => {
        options.forEach((option) => {
            if (!attribute_options[option.attribute_code]) {
                attribute_options[option.attribute_code] = [];
            }
            if (attribute_options[option.attribute_code].indexOf(option.value_index) == -1) {
                attribute_options[option.attribute_code].push(option.value_index);
            }
        });
    });
    const attributes = Object.keys(attribute_options);

    const data = list
        .map((options) => {
            if (!options || options.length == 0) {
                return undefined;
            }
            const result = {
                values: [],
                data: {},
                in_stock: false,
            };

            options.forEach((option) => {
                if (!result.attribute_code) {
                    result.attribute_code = option.attribute_code;
                }
                if (!result.label) {
                    result.label = option.super_attribute_label;
                }

                const product = configurable_products.find((product) => product.sku.value == option.sku);

                const in_stock = sku_stock[option.sku];
                let enabled_options = null;

                if (in_stock) {
                    // any of the products is in stock set the whole option as in_stock
                    result.in_stock = true;
                    if (!enabled_options) {
                        enabled_options = {};
                    }
                    attributes.forEach((attribute_code) => {
                        // ignore the current attribute of the option
                        if (attribute_code == option.attribute_code) {
                            return;
                        }
                        if (!enabled_options[attribute_code]) {
                            enabled_options[attribute_code] = [];
                        }
                        enabled_options[attribute_code].push(get_attribute_value(product, attribute_code));
                    });
                }

                // add the options
                if (!result.data[option.value_index]) {
                    // the option is new and should be added to the result data and as value
                    const skus = {};
                    skus[option.sku] = sku_stock[option.sku];

                    result.values.push({
                        key: option.value_index,
                        title: option.default_title || option.option_title || option.value_index,
                        in_stock,
                        enabled_options,
                        skus,
                    });
                    result.data[option.value_index] = [];
                } else {
                    // the option was already there, add the enabled options
                    result.values = result.values.map((value) => {
                        if (value.key == option.value_index) {
                            value.skus[option.sku] = sku_stock[option.sku];
                            if (enabled_options) {
                                const new_enabled = value.enabled_options || {};
                                Object.entries(enabled_options).forEach(([key, values]) => {
                                    if (!new_enabled[key]) {
                                        new_enabled[key] = [];
                                    }
                                    values.forEach((value) => {
                                        // only add the value if it not already exists
                                        if (new_enabled[key].indexOf(value) == -1) {
                                            new_enabled[key].push(value);
                                        }
                                    });
                                });
                                value.enabled_options = new_enabled;
                            }
                            // if any of the options is in stock set the option in_stock
                            if (in_stock) {
                                value.in_stock = true;
                            }
                        }
                        return value;
                    });
                }
                // append the option with the whole product
                const new_option = {
                    sku: option.sku,
                    product: Object.assign({}, product),
                };
                result.data[option.value_index].push(new_option);
            });
            return result;
        })
        .filter((x) => x);

    return data;
}
