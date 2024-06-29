<script>
    import { get_attribute_value } from '@src/shop/core/attributes.js';
    import { to_currency } from '@src/shop/core/currency.js';

    export let product;
    export let locale = 'en';
    export let currency = 'EUR';

    $: final_price = get_attribute_value(product, 'final_price');
    $: regular_price = get_attribute_value(product, 'price');
    $: has_special_price = final_price != regular_price;
    $: final_price_text = final_price != null ? to_currency(final_price, locale, currency) : '-';
    $: regular_price_text = regular_price != null ? to_currency(regular_price, locale, currency) : '-';
</script>

<div>
    <span class="price">{final_price_text}</span>
    {#if has_special_price}
        <span class="regular_price_text">
            {__('product.regular_price')}
            <span class="regular_price">
                {regular_price_text}
            </span>
        </span>
    {/if}
</div>
