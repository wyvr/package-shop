export function to_currency(price, locale, currency) {
    if(!locale) {
        locale = 'en-UK';
    }
    if(!currency) {
        currency = 'EUR';
    }
    if(price == null) {
        price = 0;
    }
    // @see https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
    const format = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        style: 'currency',
        currency,
    });
    return format.format(price);
}