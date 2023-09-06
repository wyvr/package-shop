<script>
    wyvr: {
        render: 'hydrate';
        loading: 'interact';
    }

    import Paging from '@src/shop/category/Paging.svelte';
    import Error from '@src/shop/Error.svelte';
    import Sort from '@src/shop/category/Sort.svelte';
    import Facet from '@src/shop/category/Facet.svelte';
    import { sort } from '@src/shop/category/sort_products.mjs';
    import { filter } from '@src/shop/category/filter_products.mjs';
    import Tags from '@src/shop/component/Tags.svelte';
    import { get_tags, change_tags } from '@src/shop/category/tags_helper.js';

    export let name;
    export let products;
    export let store = 'en';
    export let locale = 'en';
    export let currency = 'EUR';

    let sort_by = 'position';
    let asc = true;
    let filter_config = undefined;
    let details = {};
    let show_facets = false;

    $: is_filled = Array.isArray(products) && products.length > 0;
    $: filtered_products = products ? sort(filter(products, filter_config), sort_by, asc) : [];
    $: tags = get_tags(filter_config, details);

    function update_details(data) {
        details = data;
    }
</script>

<section>
    <button class="toggle" class:show={show_facets} on:click={() => (show_facets = !show_facets)}
        >⚙ {__('facet.show_facets')}<span /></button
    >
    <aside class:show={show_facets}>
        <Facet bind:filter={filter_config} products={filtered_products} on:details={(e) => update_details(e.detail)} />
    </aside>
    <div class="main">
        <div class="controls">
            <Tags {tags} on:change={(e) => (filter_config = change_tags(e.detail, filter_config))} />

            {#if is_filled}
                <Sort bind:sort_by bind:asc />
            {/if}
        </div>
        {#if is_filled}
            <Paging products={filtered_products} {store} {name} {locale} {currency} />
        {:else}
            <Error text={__('category.no_products')} />
        {/if}
    </div>
</section>
