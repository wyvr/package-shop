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
    if (!configurable_options || typeof configurable_options != 'object' || Array.isArray(configurable_options)) {
        return undefined;
    }

    const list = Object.values(configurable_options);
    const attributes = list.map((options) => options[0]?.attribute_code);
    return list
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

                const product = (Array.isArray(configurable_products) ? configurable_products : []).find(
                    (product) => product.sku.value == option.sku
                );
                const stock = get_stock(product);
                const in_stock = !!(stock.qty > 0 && stock.is_in_stock);
                let disable_options = null;
                if (in_stock) {
                    result.in_stock = true;
                } else {
                    disable_options = {};
                    attributes.forEach((attribute_code) => {
                        if (result.attribute_code == attribute_code) {
                            return undefined;
                        }
                        if (!disable_options[attribute_code]) {
                            disable_options[attribute_code] = [];
                        }
                        disable_options[attribute_code].push(get_attribute_value(product, attribute_code));
                    });
                }
                if (!result.data[option.value_index]) {
                    result.values.push({
                        key: option.value_index,
                        title: option.default_title || option.option_title || option.value_index,
                        in_stock,
                        disable_options,
                    });
                    result.data[option.value_index] = [];
                } else {
                    result.values.forEach((value) => {
                        if (value.key == option.value_index && disable_options) {
                            const new_disabled = value.disable_options || {};
                            Object.keys(disable_options).forEach((key) => {
                                if (!new_disabled[key]) {
                                    new_disabled[key] = [];
                                }
                                new_disabled[key].push(...disable_options[key]);
                            });
                            value.in_stock = false;
                            value.disable_options = new_disabled;
                        }
                    });
                }

                const new_option = {
                    sku: option.sku,
                    product,
                };
                result.data[option.value_index].push(new_option);
            });
            return result;
        })
        .filter((x) => x);
}
