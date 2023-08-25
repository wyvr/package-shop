<script>
    import { compare } from '@src/shop/stores/compare';
    import { onMount } from 'svelte';

    wyvr: {
        render: 'hydrate';
        loading: 'lazy';
    }

    export let sku;

    let contains = false;

    $: button_text = contains ? 'compare.remove_from_compare' : 'compare.add_to_compare';

    onMount(() => {
        compare.subscribe((compare) => {
            if (!sku || typeof sku != 'string') {
                return;
            }
            const contains_sku = sku.toLowerCase();
            contains = compare.items.includes(contains_sku);
        });
    });

    function toggle() {
        compare.toggle(sku);
    }
</script>

<button class="btn" on:click={toggle} css:contains>
    <slot>{__(button_text)}</slot>
</button>

<style>
        @import '@src/shop/component/btn.css';

</style>
