<script>
    import { onMount } from 'svelte';
    import Qty from '@src/shop/product/Qty.svelte';
    import AddToCartButton from '@src/shop/cart/AddToCartButton.svelte';
    import { cart } from '@src/shop/stores/cart';

    wyvr: {
        render: 'hydrate';
        loading: 'interact';
    }

    export let sku;
    export let qty = 1;
    export let disabled = false;
    let in_cart = false;

    onMount(() => {
        // when the product is already in the cart use the given qty
        cart.subscribe((cart) => {
            const item = cart?.items?.find((item) => item.sku === sku);
            if (item) {
                in_cart = true;
                qty = item.qty;
            }
        });
    });
</script>

<section>
    <Qty bind:qty />
    <AddToCartButton {sku} {disabled} {qty} />
    {#if in_cart}
        <span>{__('cart.is_in_cart')}</span>
    {/if}
</section>

<style>
    section {
        display: flex;
        gap: 1rem;
        flex-flow: wrap;
        align-items: center;
    }
    section > :global([data-hydrate]) {
        display: flex;
    }
</style>
