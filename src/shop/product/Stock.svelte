<script>
    import { get_stock } from '@src/shop/core/product/get_stock.js';
    import Stock from '@src/shop/component/Stock.svelte';

    export let product;
    $: stock = get_stock(product);
    $: in_stock = stock?.is_in_stock || false;
    $: qty = stock?.qty || 0;
</script>

<Stock {in_stock} {qty} />
