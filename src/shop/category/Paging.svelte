<script>
    wyvr: {
        render: 'hydrate';
    }

    import List from '@src/shop/category/List.svelte';
    import Error from '@src/shop/Error.svelte';
    import Paging from '@src/shop/component/Paging.svelte';
    import { onMount } from 'svelte';
    import { get_hash, update_hash } from '@src/shop/core/url_hash.mjs';

    export let name;
    export let products;
    export let store = 'en';
    export let page = 1;
    export let items_per_page = 11;
    export let locale = 'en';
    export let currency = 'EUR';
    export let list_id;

    const id = 'product-list';

    $: is_filled = Array.isArray(products) && products.length > 0;
    $: paged_products = products ? products.slice((page - 1) * items_per_page, page * items_per_page) : [];
    $: amount = products ? products.length : 0;
    $: max = Math.ceil(amount / items_per_page);
    $: trigger_events(paged_products);

    onMount(() => {
        const hash = get_hash();
        if (hash && hash.p) {
            let p = 1;
            try {
                p = parseInt(hash.p, 10);
            } catch (e) {
                return;
            }
            page = p;
        }
        window.addEventListener('popstate', (e) => {
            if (e.state?.p) {
                if (!isNaN(e.state.p)) {
                    page = e.state.p;
                }
            }
        });
    });

    function update_page({ detail }) {
        page = detail.page;
        const hash_page = detail.page != 1 ? detail.page : undefined;
        update_hash({ p: hash_page });
        let scrolled = false;
        // try to scroll to the selected id element
        Object.entries(get_hash()).find(([key, value]) => {
            // hash without value
            if (value === true) {
                const el = document.getElementById(key);
                if (el) {
                    el.scrollIntoView({ block: 'start' });
                    scrolled = true;
                }
            }
        });
        if (!scrolled && id) {
            document.getElementById(id)?.scrollIntoView({ block: 'start' });
        }
    }
    let debouncer;
    function trigger_events(paged_products) {
        if (isServer) {
            return;
        }
        clearTimeout(debouncer);
        debouncer = setTimeout(() => {
            trigger('paging.products', paged_products);
        }, 1000);
    }
</script>

{#if is_filled}
    <List {id} {list_id} products={paged_products} {store} {name} {locale} {currency} />
    <Paging {page} {max} on:change={update_page} show_pages={true} />
{:else}
    <Error text={__('category.no_products')} />
{/if}
