<script>
    import { compare } from '@src/shop/stores/compare';
    import { load_product } from '@src/shop/api-client/product/load_product';
    import { messages } from '@src/shop/stores/messages';
    import Spinner from '@src/shop/component/Spinner.svelte';
    import ListItem from '@src/shop/product/ListItem.svelte';
    import ToggleButton from '@src/shop/compare/ToggleButton.svelte';
    import AddToCartButton from '@src/shop/cart/AddToCartButton.svelte';
    import { compare_attributes } from '@src/shop/config/compare_attributes.mjs';
    import { onMount } from 'svelte';
    import Empty from '@src/shop/compare/Empty.svelte';
    import { get_attribute_label, get_attribute_name, get_attribute_value } from '@src/shop/core/attributes.mjs';
    import ImageAttribute from '@src/shop/product/ImageAttribute.svelte';
    import Price from '@src/shop/product/Price.svelte';

    wyvr: {
        render: 'hydrate';
        loading: 'instant';
    }

    export let store;
    export let locale;
    export let currency;

    let state = 'idle';
    let attributes = [];

    let cache = {};
    let cache_timer;
    $: items = get_items($compare);
    $: description = get_label_of_cache('description');

    onMount(() => {
        if (items) {
            state = 'busy';
        }
        cache = load_cache(cache);
    });

    function get_items(compare) {
        if (isServer || !cache || !compare?.items || compare.items.length == 0) {
            return undefined;
        }
        compare.items.forEach(async (sku) => {
            if (cache && cache[sku]) {
                update_cache();
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

        return compare.items;
    }
    function load_cache(current_cache = {}) {
        if (isServer || !sessionStorage) {
            return {};
        }
        try {
            const value = sessionStorage.getItem('compare_cache');
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
        if (items && Object.keys(cache).length >= items.length) {
            state = 'idle';
            update_attributes();
        }
        if (cache_timer) {
            clearTimeout(cache_timer);
        }
        cache_timer = setTimeout(() => {
            sessionStorage.setItem('compare_cache', JSON.stringify(cache));
        }, 500);
    }
    function update_attributes() {
        attributes = compare_attributes
            .map((attribute) => {
                const data = {
                    code: attribute,
                };
                const sku = items.find((sku) => {
                    return cache[sku][attribute];
                });
                if (!sku) {
                    return undefined;
                }
                data.name = get_attribute_label(cache[sku], attribute);
                return data;
            })
            .filter(Boolean);
    }
    function get_label_of_cache(name) {
        const found = Object.values(cache)
            .map((product) => {
                return get_attribute_label(product, name);
            })
            .find(Boolean);
        return found;
    }
</script>

{#if items}
    {#if state == 'busy'}
        <Spinner />
    {:else}
        <section>
            <table>
                <tr>
                    <td />
                    {#each items as sku}
                        <td>
                            <ImageAttribute product={cache[sku]} name="thumbnail" width={300} height={300} />
                        </td>
                    {/each}
                </tr>
                <tr>
                    <th><div>{get_label_of_cache('name')}</div></th>
                    {#each items as sku}
                        <td>
                            <b>{get_attribute_value(cache[sku], 'name')}</b>
                        </td>
                    {/each}
                </tr>

                {#each attributes as attribute}
                    <tr>
                        <th><div>{attribute.name}</div></th>
                        {#each items as sku}
                            {@const value = get_attribute_name(cache[sku], attribute.code) || '-'}
                            {#if ['string', 'number'].indexOf(typeof value) > -1}
                                <td>{value}</td>
                            {:else if value.value}
                                <td>{value.value}</td>
                            {:else}
                                <td>{JSON.stringify(value)}</td>
                            {/if}
                        {/each}
                    </tr>
                {/each}
                <tr>
                    <th><div>{get_label_of_cache('price')}</div></th>
                    {#each items as sku}
                        <td><Price product={cache[sku]} {locale} {currency} /></td>
                    {/each}
                </tr>
                <tr>
                    <th />
                    {#each items as sku}
                        <td>
                            <AddToCartButton {sku} />
                            <button class="btn" on:click={() => compare.toggle(sku)}
                                >{__('compare.remove_from_compare')}</button
                            >
                        </td>
                    {/each}
                </tr>
                {#if description}
                    <tr>
                        <th><div>{description}</div></th>
                        {#each items as sku}
                            <td>{@html get_attribute_value(cache[sku], 'description')} </td>
                        {/each}
                    </tr>
                {/if}
            </table>
        </section>
    {/if}
{:else}
    <Empty {store} {locale} {currency} />
{/if}

<style>
    @import '@src/shop/component/btn.css';

    section {
        max-width: 100%;
        overflow-x: auto;
        position: relative;
    }
    table {
        border-collapse: collapse;
    }
    th {
        white-space: nowrap;
    }
    th,
    td {
        vertical-align: top;
        padding: 0.1em 0.5em;
        background-color: var(--color-bg);
    }
    tr:nth-child(even) th,
    tr:nth-child(even) td {
        background-color: color-mix(in srgb, var(--color-bg) 100%, var(--color-text) 10%);
    }
    tr:hover th,
    tr:hover td {
        background-color: color-mix(in srgb, var(--color-bg) 100%, var(--color-primary) 20%);
    }
</style>
