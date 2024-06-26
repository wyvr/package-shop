import { get_attribute_value } from '@src/shop/core/attributes.js';
import { default_stock } from '@src/shop/core/product/default_stock.js';

export function get_stock(product) {
    const stock = { ...default_stock };
    const stock_attr = get_attribute_value(product, 'stock');
    if (stock_attr) {
        for (const [key, value] of Object.entries(stock_attr)) {
            stock[key] = value;
        }
    }

    if (product?.type_id === 'configurable' && product?.configurable_products) {
        const child_stocks = product.configurable_products.map((child) => get_attribute_value(child, 'stock')).filter(Boolean);
        stock.is_in_stock = child_stocks.find((s) => s.is_in_stock === '1') != null;
        stock.qty = Math.max(...child_stocks.map((s) => parseFloat(s.qty)));
    }
    return stock;
}
