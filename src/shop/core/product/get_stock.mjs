import { get_attribute_value } from '../attributes.mjs';

export function get_stock(product) {
    const stock = get_attribute_value(product, 'stock');
    if (product?.type_id == 'configurable' && product?.configurable_products) {
        const child_stocks = product.configurable_products.map((child) => get_attribute_value(child, 'stock'));
        stock.is_in_stock = child_stocks.find((s) => s.is_in_stock == '1') != null;
        stock.qty = Math.max(...child_stocks.map((s) => parseFloat(s.qty)));
    }
    return stock;
}
