<script>
    import { wishlist } from '@src/shop/stores/wishlist';
    import { load_product } from '@src/shop/api-client/product/load_product';
    import { messages } from '@src/shop/stores/messages';
    import Spinner from '@src/shop/component/Spinner.svelte';
    import ListItem from '@src/shop/product/ListItem.svelte';
    import ToggleButton from '@src/shop/wishlist/ToggleButton.svelte';
    import AddToCartButton from '@src/shop/cart/AddToCartButton.svelte';
    import { onMount } from 'svelte';
    import Empty from '@src/shop/wishlist/Empty.svelte';

    wyvr: {
        render: 'hydrate';
        loading: 'instant';
    }

    export let store;
    export let locale;
    export let currency;

    let cache = {};
    let cache_timer;
    $: items = get_items($wishlist);

    onMount(() => {
        cache = load_cache(cache);
    });

    function get_items(wishlist) {
        if (isServer || !cache || !wishlist?.items || wishlist.items.length == 0) {
            return undefined;
        }
        wishlist.items.forEach(async (sku) => {
            if (cache && cache[sku]) {
                return;
            }
            const [error, product] = await load_product(sku);
            if (error) {
                messages.push(__('shop.internal_error', error), 'error');
                return;
            }
            if (!cache) {
            }
            cache[sku] = product;
            update_cache();
        });

        return wishlist.items;
    }
    function load_cache(current_cache = {}) {
        if (isServer || !sessionStorage) {
            return {};
        }
        try {
            const value = sessionStorage.getItem('wishlist_cache');
            if (!value) {
                return current_cache;
            }
            const cache = JSON.parse(value);
            if (current_cache) {
                Object.keys(current_cache).forEach((key) => {
                    cache[key] = current_cache[key];
                });
            }
            return cache;
        } catch (e) {
            console.error(e);
            return current_cache;
        }
    }
    function update_cache() {
        if (!cache) {
            return;
        }
        if (cache_timer) {
            clearTimeout(cache_timer);
        }
        cache_timer = setTimeout(() => {
            sessionStorage.setItem('wishlist_cache', JSON.stringify(cache));
        }, 500);
    }
    function toggle({ sku }) {
        if (sku) {
            wishlist.toggle(sku);
        }
    }
</script>

{#if items}
    <section>
        {#each items as sku}
            <div>
                {#if cache && cache[sku]}
                    <ListItem product={cache[sku]} {store} {locale} {currency}>
                        <div class="actions" slot="bottom">
                            <AddToCartButton {sku} on:click={(e) => toggle(e.detail)} />
                            <ToggleButton {sku} />
                        </div>
                    </ListItem>
                {:else}
                    <Spinner />
                {/if}
            </div>
        {/each}
    </section>
{:else}
    <Empty {store} {locale} {currency} />
{/if}

<style>
    @import '@src/shop/category/grid.css';
    .actions {
        padding-left: 1em;
        padding-right: 1em;
    }
</style>
