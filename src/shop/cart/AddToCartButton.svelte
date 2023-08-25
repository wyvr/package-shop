<script>
    import InlineSpinner from '@src/shop/component/InlineSpinner.svelte';
    import { cart } from '@src/shop/stores/cart';

    wyvr: {
        render: 'hydrate';
        loading: 'interact';
    }

    export let sku;
    export let qty = 1;
    export let disabled = false;

    let state = 'idle';
    $: button_text = qty > 0 ? 'product.add_to_cart' : 'product.remove_from_cart';

    async function add_to_cart() {
        state = 'busy';
        cart.update_item(sku, qty);
        state = 'idle';
    }
</script>

{#if state == 'busy'}
    <button class="btn" {disabled} type="button"><InlineSpinner /> <slot>{__(button_text)}</slot></button>
{:else}
    <button class="btn" {disabled} type="button" on:click={add_to_cart}><slot>{__(button_text)}</slot></button>
{/if}

<style>
    @import '@src/shop/component/btn.css';
</style>
