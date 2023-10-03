<script>
    import { onMount } from 'svelte';
    import Spinner from '@src/shop/component/Spinner.svelte';
    import Error from '@src/shop/Error.svelte';
    import { strip_tags } from '@src/shop/core/sanitize.mjs';
    import { cart } from '@src/shop/stores/cart';
    import { url_join } from '@src/shop/core/url.mjs';
    import { load_product } from '@src/shop/api-client/product/load_product';
    import { get_attribute_value } from '@src/shop/core/attributes.mjs';

    wyvr: {
        render: 'hydrate';
        loading: 'instant';
    }

    export let store;
    let sku;
    let email;
    let product;

    let state = 'loading';
    $: url = url_join(store);

    async function try_add_to_cart() {
        if (!email || !sku) {
            state = 'error';
            return;
        }
        state = 'loading';
        const [error, loaded_product] = await load_product(sku);
        if (error || !loaded_product) {
            state = 'error';
            console.error('error loading product', sku, error);
            return;
        }
        product = {
            sku,
            name: get_attribute_value(loaded_product, 'name'),
        };
        await cart.update_item(sku, 1);
        state = 'success';
    }

    onMount(() => {
        email = atob(strip_tags(new URLSearchParams(window.location.search).get('email')));
        sku = atob(strip_tags(new URLSearchParams(window.location.search).get('sku')));

        try_add_to_cart();
    });
</script>

<div class="m-cart-to-cart-from-url" :class="cssClass">
    {#if state == 'loading'}
        <p>{@html __('product_to_cart.loading')}</p>
        <Spinner />
    {:else if state == 'success'}
        <div class="success">
            {@html __('product_to_cart.success', product)}
        </div>
        <div>
            <p><a href={url}>{__('shop.to_home')}</a></p>
        </div>
    {:else}
        <Error text={__('product_to_cart.error')} />
    {/if}
</div>
