export function to_currency(price, locale = 'en-UK', currency = 'EUR') {
    let updated_price = price;
    if (updated_price == null) {
        updated_price = 0;
    }
    // add null check because null is a defined value
    if(!locale) {
        locale = 'en-UK';
    }
    if(!currency) {
        currency = 'EUR';
    }
    // @see https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
    const format = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        style: 'currency',
        currency
    });
    return format.format(updated_price);
}
