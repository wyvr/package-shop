<script>
    import facets from '@src/shop/config/facets.mjs';
    import { onMount, createEventDispatcher } from 'svelte';

    import { get_filter_options } from '@src/shop/category/filter_products.mjs';
    import FacetBool from '@src/shop/facet/block/FacetBool.svelte';
    import FacetList from '@src/shop/facet/block/FacetList.svelte';
    import FacetSlider from '@src/shop/facet/block/FacetSlider.svelte';
    import { get_code_of_attribute, get_data_of_attribute } from '@src/shop/facet/facet_helper.js';

    export let filter = {};
    export let products = [];

    const dispatch = createEventDispatcher();
    //$: update(products);

    let options = undefined;
    let max = 0;
    let details = {};

    onServer(() => {
        update(products);
    });
    onMount(() => {
        update(products);
    });
    function update(products) {
        max = products.length;
        options = get_options();
    }
    function get_options() {
        return get_filter_options(facets.attributes, products);
    }
    function update_details(data) {
        const new_details = {};
        Object.keys(filter).forEach((key) => {
            new_details[key] = details[key];
            if (data.key == key) {
                new_details[key] = data.details;
            }
        });
        details = new_details;
        dispatch('details', details);
    }
</script>

{#if options}
    <section>
        {#each facets.attributes as entry}
            {@const code = get_code_of_attribute(entry)}
            {@const data = get_data_of_attribute(options, code)}
            {#if data !== undefined}
                {#if entry.type == 'bool'}
                    <FacetBool
                        name={code}
                        bind:value={filter[code]}
                        headline={__(entry.name)}
                        amount={data[0].skus.length}
                        {max}
                    />
                {:else if entry.type == 'list'}
                    <FacetList
                        name={code}
                        bind:value={filter[code]}
                        headline={__(entry.name)}
                        list={data}
                        min={facets.min_entries}
                        on:details={(e) => update_details(e.detail)}
                    />
                {:else if entry.type == 'slider'}
                    <FacetSlider name={code} bind:value={filter[code]} headline={__(entry.name)} list={data} />
                {/if}
            {/if}
        {/each}
    </section>
{/if}

<!-- <b>options</b>
<pre>{JSON.stringify(options, null, 4)}</pre> -->

<!-- <b>filter</b>
<pre>{JSON.stringify(filter, null, 4)}</pre> -->

<!-- <b>facets.attributes</b>
<pre>{JSON.stringify(facets.attributes, null, 4)}</pre> -->
