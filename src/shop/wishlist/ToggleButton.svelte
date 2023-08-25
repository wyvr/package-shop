<script>
    import { wishlist } from '@src/shop/stores/wishlist';
    import { onMount } from 'svelte';

    wyvr: {
        render: 'hydrate';
        loading: 'lazy';
    }

    export let sku;

    let contains = false;

    $: button_text = contains ? 'wishlist.remove_from_wishlist' : 'wishlist.add_to_wishlist';

    onMount(() => {
        wishlist.subscribe((wishlist) => {
            if (!sku || typeof sku != 'string') {
                return;
            }
            const contains_sku = sku.toLowerCase();
            contains = wishlist.items.includes(contains_sku);
        });
    });

    function toggle() {
        wishlist.toggle(sku);
    }
</script>

<button class="btn" on:click={toggle} css:contains>
    <slot>{__(button_text)}</slot>
</button>

<style>
        @import '@src/shop/component/btn.css';

</style>
