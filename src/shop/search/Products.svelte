<script>
    import Error from '@src/shop/Error.svelte';
    import ListItem from '@src/shop/product/ListItem.svelte';

    export let products;
    export let store = 'en';
    export let locale = 'en';
    export let currency = 'EUR';
</script>

{#if Array.isArray(products) && products.length > 0}
    <section>
        {#each products as product}
            <div>
                <ListItem {product} {store} {locale} {currency} />
            </div>
        {/each}
    </section>
{:else}
    <Error text={__('search.nothing_found')} />
{/if}
