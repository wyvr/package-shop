<script>
    import Name from '@src/shop/product/Name.svelte';
    import Stock from '@src/shop/product/Stock.svelte';
    import Price from '@src/shop/product/Price.svelte';
    import Attribute from '@src/shop/product/Attribute.svelte';
    import ImageAttribute from '@src/shop/product/ImageAttribute.svelte';
    import AttributeList from '@src/shop/product/AttributeList.svelte';
    import Badges from '@src/shop/product/Badges.svelte';
    import { get_detail_attributes } from '@src/shop/product/get_detail_attributes.mjs';
    import AddToCart from '@src/shop/product/AddToCart.svelte';
    import Wishlist from '@src/shop/wishlist/ToggleButton.svelte';
    import Compare from '@src/shop/compare/ToggleButton.svelte';
    import MediaGallery from '@src/shop/product/MediaGallery.svelte';

    export let data = null;
    export let locale = null;
    export let currency = null;

    const detail_attributes = get_detail_attributes();

    onServer(() => {});
</script>

<div class="main">
    <div class="name">
        <Name product={data.product} />
    </div>
    <div class="image">
        <Badges product={data.product} />
        <MediaGallery product={data.product} />
    </div>
    <div class="info">
        <Stock product={data.product} />
        <Price product={data.product} {locale} {currency} />

        <AddToCart sku={data.product.sku.value} />
        <div><Wishlist sku={data.product.sku.value} /> <Compare sku={data.product.sku.value} /></div>

        <Attribute name="description" product={data.product} as_html={true} />
    </div>
</div>
<div class="details">
    <div>More Information</div>
    <AttributeList attributes={detail_attributes} product={data.product} />
</div>

<style>
    @import '@src/shop/product/layout/_detail.css';
</style>
