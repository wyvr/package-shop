<script>
    import ImageAttribute from '@src/shop/product/ImageAttribute.svelte';
    import Price from '@src/shop/product/Price.svelte';
    import Badges from '@src/shop/product/Badges.svelte';
    import Stock from '@src/shop/product/Stock.svelte';
    import { get_attribute_value } from '@src/shop/core/attributes.mjs';
    import { url_join } from '@src/shop/core/url.mjs';

    export let product;
    export let store;
    export let locale = 'en';
    export let currency = 'EUR';

    const slug = _inject('config.magento2.slug.product', 'product');

    $: link = url_join(store, slug, get_attribute_value(product, 'url_key'));
    $: sku = get_attribute_value(product, 'sku');
    $: name = get_attribute_value(product, 'name');
</script>

{#if product}
    <div class="product" data-sku={sku}>
        <slot name="top" />
        <div class="image">
            <Badges {product} />
            <a href={link}>
                <ImageAttribute {product} name="thumbnail" width={300} height={300} />
            </a>
        </div>
        <div class="name"><a href={link}>{@html name}</a></div>
        <div class="price"><a href={link}><Price {product} {locale} {currency} /></a></div>
        {#if product.stock}
            <div class="stock">
                <Stock {product} />
            </div>
        {/if}
        <slot name="bottom" />
    </div>
{/if}
