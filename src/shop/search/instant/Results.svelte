<script>
    import { createEventDispatcher } from 'svelte';

    import Product from '@src/shop/search/instant/Product.svelte';
    import Category from '@src/shop/search/instant/Category.svelte';
    import Page from '@src/shop/search/instant/Page.svelte';
    import Suggestions from '@src/shop/search/Suggestions.svelte';

    export let data;
    export let open = false;
    $: term = data?.term;
    const dispatch = createEventDispatcher();

    function close() {
        open = false;
    }
    function force_search() {
        dispatch('force_search');
    }
    function contains_results(type_data) {
        return Array.isArray(type_data) && type_data.length > 0;
    }
</script>

{#if term && open}
    <section>
        <button class="btn close" on:click={close}>{__('shop.close')}</button>
        <div class="header">
            {__('search.search_results_for', { term })}
        </div>
        {#if data.suggestion}
            <div class="suggestions">
                <Suggestions suggestions={data.suggestion} />
            </div>
        {/if}
        {#if contains_results(data.search.product)}
            <div class="products">
                <header>{__('search.products')}</header>
                {#each data.search.product as product}
                    <Product {product} {term} store={data.store} locale={data.locale} currency={data.currency} />
                {/each}
            </div>
        {/if}
        {#if contains_results(data.search.category)}
            <div class="categories">
                <header>{__('search.categories')}</header>
                {#each data.search.category as category}
                    <Category {category} store={data.store} />
                {/each}
            </div>
        {/if}
        {#if contains_results(data.search.page)}
            <div class="pages">
                <header>{__('search.pages')}</header>
                {#each data.search.page as page}
                    <Page {page} store={data.store} />
                {/each}
            </div>
        {/if}
        <div class="footer">
            <button class="btn" on:click={force_search}>{__('search.more_results')}</button>
        </div>
    </section>
    <button class="backdrop" on:click={close}>{__('shop.close')}</button>
{/if}
