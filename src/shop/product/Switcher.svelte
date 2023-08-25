<script>
    import { onMount } from 'svelte';

    wyvr: {
        render: 'hydrate';
        loading: 'lazy';
    }

    export let product;

    let slot_product;

    onServer(() => {
        slot_product = product;
    });
    onMount(() => {
        slot_product = product;
        on('shop-product-switch', (switch_product) => {
            if (switch_product.sku.value == product.sku.value) {
                return;
            }
            slot_product = switch_product;
        });
    });
</script>

<div>
    <slot product={slot_product} />
</div>
