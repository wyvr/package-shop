<script>
    import { onMount } from 'svelte';

    import ProductSwitcher from '@src/shop/product/Switcher.svelte';
    import Stock from '@src/shop/product/Stock.svelte';
    import Price from '@src/shop/product/Price.svelte';
    import Name from '@src/shop/product/Name.svelte';
    import ConfigurableOptions from '@src/shop/product/configurable/ConfigurableOptions.svelte';
    import { get_configurable_data } from '@src/shop/product/configurable/get_configurable_data.mjs';

    import Attribute from '@src/shop/product/Attribute.svelte';
    import AttributeList from '@src/shop/product/AttributeList.svelte';
    import Badges from '@src/shop/product/Badges.svelte';
    import { get_detail_attributes } from '@src/shop/product/get_detail_attributes.mjs';
    import AddToCart from '@src/shop/product/AddToCart.svelte';
    import Wishlist from '@src/shop/wishlist/ToggleButton.svelte';
    import Compare from '@src/shop/compare/ToggleButton.svelte';
    import MediaGallery from '@src/shop/product/MediaGallery.svelte';

    wyvr: {
        render: 'hydrate';
        loading: 'instant';
    }

    export let product;
    export let configurable;
    export let locale;
    export let currency;

    const detail_attributes = get_detail_attributes();

    onServer(() => {
        if (product?.type_id == 'configurable') {
            configurable = get_configurable_data(product?.configurable_options, product?.configurable_products);
        }
    });
    onMount(() => {
        state = 'client';
        color = 'green';
    });
    function select_configurable(e) {
        const selected_data = e.detail;

        const products_from_attribute = configurable
            .map((attribute) => {
                const value = selected_data[attribute.attribute_code];
                if (!value) {
                    return undefined;
                }
                return attribute.data[value.key];
            })
            .filter((x) => x);

        const overlapped_products = products_from_attribute.reduce((acc, curr) => {
            if (!acc) {
                return curr;
            }
            const skus = curr.map((entry) => entry.sku);
            return acc.filter((entry) => skus.indexOf(entry.sku) > -1);
        }, undefined);

        const selected_product = overlapped_products.find((x) => x)?.product;
        trigger('shop-product-switch', selected_product);
    }
</script>

<div class="main">
    <div class="name">
        <Name {product} />
    </div>
    <div class="image">
        <Badges {product} />
        <MediaGallery {product} />
    </div>
    <div class="info">
        <ProductSwitcher {product} let:product>
            {#if product}
                <Stock {product} />
                <Price {product} {locale} {currency} />
            {/if}
        </ProductSwitcher>

        {#if configurable}
            <ConfigurableOptions data={configurable} on:selected={select_configurable} />
        {/if}

        <ProductSwitcher {product} let:product>
            {#if product}
                <AddToCart sku={product.sku.value} disabled={product.type_id != 'simple'} />

                <div><Wishlist sku={product.sku.value} /> <Compare sku={product.sku.value} /></div>
            {/if}
        </ProductSwitcher>
        <Attribute name="description" {product} as_html={true} />
    </div>
</div>
<div class="details">
    <div>More Information</div>
    <AttributeList attributes={detail_attributes} {product} />
</div>

<style>
    @import '@src/shop/product/layout/_detail.css';
</style>
