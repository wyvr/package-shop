<script>
    import { onMount } from 'svelte';

    import ProductSwitcher from '@src/shop/product/Switcher.svelte';
    import Stock from '@src/shop/product/Stock.svelte';
    import Price from '@src/shop/product/Price.svelte';
    import Name from '@src/shop/product/Name.svelte';
    import ConfigurableOptions from '@src/shop/product/configurable/ConfigurableOptions.svelte';
    import { get_configurable_data } from '@src/shop/product/configurable/get_configurable_data.mjs';
    import { get_cookies, update_cookie } from '@src/shop/core/cookies.mjs';

    import Attribute from '@src/shop/product/Attribute.svelte';
    import AttributeList from '@src/shop/product/AttributeList.svelte';
    import Badges from '@src/shop/product/Badges.svelte';
    import { get_detail_attributes } from '@src/shop/product/get_detail_attributes.mjs';
    import AddToCart from '@src/shop/product/AddToCart.svelte';
    import Wishlist from '@src/shop/wishlist/ToggleButton.svelte';
    import Compare from '@src/shop/compare/ToggleButton.svelte';
    import MediaGallery from '@src/shop/product/MediaGallery.svelte';

    import { get_attribute_value } from '@src/shop/core/attributes.mjs';
    import { add_history } from '@src/shop/core/history.mjs';
    import { url_join } from '@src/shop/core/url.mjs';
    import { get_stock } from '@src/shop/core/product/get_stock.mjs';

    wyvr: {
        render: 'hydrate';
        loading: 'instant';
    }

    export let product;
    export let configurable;
    export let locale;
    export let currency;
    export let store = null;

    const detail_attributes = get_detail_attributes();

    let pre_selected_options;

    onServer(() => {
        if (product?.type_id == 'configurable') {
            configurable = get_configurable_data(product?.configurable_options, product?.configurable_products);
        }
    });
    onMount(() => {
        const simple_options = get_redirected_from_simple_options();
        if (simple_options && _inject('config.magento2.product.redirect_simple_to_configurable')) {
            // remove the redirect cookie
            update_cookie({ redirect_from_simple: undefined });

            pre_selected_options = simple_options;
            select_configurable({ detail: simple_options });
        }
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

        if (selected_product) {
            const slug = _inject('config.shop.slug.product', 'product');
            const url_key = get_attribute_value(selected_product, 'url_key');
            const title = get_attribute_value(selected_product, 'name');
            add_history(
                { source: url_key, target: location.pathname },
                title,
                url_join(getStack('store')?.key, slug, url_key)
            );
        }

        trigger('shop-product-switch', selected_product);
    }

    function get_redirected_from_simple_options() {
        if (product?.type_id != 'configurable') {
            return undefined;
        }
        const redirect_from_simple = get_cookies()?.redirect_from_simple;
        if (!redirect_from_simple) {
            return undefined;
        }
        // search product by the url_key
        const redirected_simple = product.configurable_products.find((p) => p.url_key.value == redirect_from_simple);
        if (!redirected_simple) {
            return undefined;
        }

        // get the option values from the options
        const simple_options = {};
        configurable.forEach((option) => {
            const product_attribute_value = get_attribute_value(redirected_simple, option.attribute_code);
            const found_option = option.values.find((option_value) => option_value.key == product_attribute_value);
            if (found_option) {
                simple_options[option.attribute_code] = found_option;
            }
        });

        return simple_options;
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
            <ConfigurableOptions data={configurable} on:selected={select_configurable} {pre_selected_options} />
        {/if}

        <ProductSwitcher {product} let:product>
            {#if product}
                <AddToCart {product} disabled={!get_stock(product).is_in_stock} />

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
