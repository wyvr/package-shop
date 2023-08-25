<script>
    import Products from '@src/shop/search/Products.svelte';
    import Categories from '@src/shop/search/Categories.svelte';
    import Pages from '@src/shop/search/Pages.svelte';
    import Suggestions from '@src/shop/search/Suggestions.svelte';
    import Form from '@src/shop/search/Form.svelte';

    export let data = null;

    $: types = Object.keys(data.search);
    $: store = data?.store?.key;
    $: currency = data?.currency;
    $: locale = data?.locale;
    $: term = data?.term || '';
</script>

<h1>{__('search.search_results_for', { term })}</h1>

<Form action={data.url} {term} />

<Suggestions suggestions={data.suggestion} />
<pre>{JSON.stringify(data.suggestion, null, 4)}</pre>

<div>
    <header>{__('search.products')}</header>
    <Products products={data.search.product} {store} {currency} {locale} />
</div>

<div>
    <header>{__('search.categories')}</header>
    <Categories categories={data.search.category} {store} />
</div>

<div>
    <header>{__('search.pages')}</header>
    <Pages pages={data.search.page} {store} store_id={data.store.value} />
</div>

<pre>{JSON.stringify(data.timing, null, 4)}</pre>
