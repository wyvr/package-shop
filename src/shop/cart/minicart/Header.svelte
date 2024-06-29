<script>
    import { to_currency } from '@src/shop/core/currency.js';

    export let count = 0;
    export let sum;
    export let locale;
    export let currency;

    $: sum_text = sum != null ? to_currency(sum, locale, currency) : '-';
</script>

<p class="title"><b>{__('cart.name')}</b></p>
<p class="items">{@html __('cart.items_in_cart', { count })}</p>
<p class="sum">{__('cart.sum')} <b>{sum_text}</b></p>

<style>
    p {
        padding: 0;
        margin: 0 0 0.2rem;
    }
    .title {
        font-size: 1.2rem;
    }
</style>
