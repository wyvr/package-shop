<script>
    import ListItem from '@src/shop/product/ListItem.svelte';
    import Error from '@src/shop/Error.svelte';
    import CustomBlock from '@src/shop/category/CustomBlock.svelte';
    import { get_attribute_value } from '@src/shop/core/attributes.js';

    export let name;
    export let products;
    export let store = 'en';
    export let locale = 'en';
    export let currency = 'EUR';
    export let id = undefined;

    $: is_filled = Array.isArray(products) && products.length > 0;
</script>

{#if is_filled}
    <section {id}>
        {#each products as product, index (get_attribute_value(product, 'sku'))}
            {@const position = index + 1}
            <div>
                <ListItem {product} {store} {locale} {currency} />
            </div>
            {#if position == 7}
                <CustomBlock {position} {product} {name} {store} />
            {/if}
        {/each}
    </section>
{:else}
    <Error text={__('category.no_products')} />
{/if}
