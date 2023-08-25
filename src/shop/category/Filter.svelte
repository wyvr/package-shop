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
    import category_filter_attributes from '@src/shop/config/category_filter_attributes.mjs';

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

    function get_tags(filter, details) {
        if (!filter || typeof filter != 'object') {
            return [];
        }
        return Object.keys(filter)
            .filter((id) => filter[id] !== undefined)
            .map((id) => {
                const data = { id, name: __('facet.' + id), details: filter[id] };
                if (details[id]) {
                    data.details = details[id];
                }
                return data;
            });
    }

    function update_details(data) {
        details = data;
    }

    function change_tags(data) {
        if (data.removed === undefined) {
            filter_config = {};
            return;
        }
        // create new filter with the remaining configs
        const new_filter = {};
        data.list
            .map((entry) => entry.id)
            .filter((x) => x)
            .forEach((key) => {
                new_filter[key] = filter_config[key];
            });
        filter_config = new_filter;
    }

    function toggle_facets() {
        show_facets = !show_facets;
    }
</script>

<section>
    <button class="toggle" class:show={show_facets} on:click={toggle_facets}>⚙ {__('facet.show_facets')}<span></span></button>
    <aside class:show={show_facets}>
        <Facet bind:filter={filter_config} products={filtered_products} on:details={(e) => update_details(e.detail)} />
    </aside>
    <div class="main">
        <div class="controls">
            <Tags {tags} on:change={(e) => change_tags(e.detail)} />

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
