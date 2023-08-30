<script>
    import ImageAttribute from '@src/shop/product/ImageAttribute.svelte';
    import { get_attribute_value } from '@src/shop/core/attributes.mjs';
    import Price from '@src/shop/product/Price.svelte';
    import { url_join } from '@src/shop/core/url.mjs';

    export let product;
    export let term = '';
    export let store;
    export let locale = 'en';
    export let currency = 'EUR';

    const slug = _inject('config.magento2.slug.product', 'product');

    $: link = url_join(store, slug, get_attribute_value(product, 'url_key'));
    $: sku = get_attribute_value(product, 'sku');
    $: name = get_attribute_value(product, 'name');
    $: sku_match = sku.toLowerCase() === term;
</script>

{#if product}
    <a href={link}>
        <ImageAttribute {product} name="thumbnail" width={50} height={50} />
        <span class="content">
            {#if sku_match}
                <span class="sku_match">★ {__('search.sku_match')}</span>
            {/if}
            <span class="name">{@html name}</span>
            <span class="price"><Price {product} {locale} {currency} /></span>
        </span>
    </a>
{/if}
