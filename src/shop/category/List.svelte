<script>
    import ListItem from '@src/shop/product/ListItem.svelte';
    import Error from '@src/shop/Error.svelte';
    import CustomBlock from '@src/shop/category/CustomBlock.svelte';

    export let name;
    export let products;
    export let store = 'en';
    export let locale = 'en';
    export let currency = 'EUR';

    $: is_filled = Array.isArray(products) && products.length > 0;
</script>

{#if is_filled}
    <section>
        {#each products as product, index (product.sku.value)}
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
