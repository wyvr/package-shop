<script>
    import Name from '@src/shop/product/Name.svelte';
    import Stock from '@src/shop/product/Stock.svelte';
    import Price from '@src/shop/product/Price.svelte';
    import Attribute from '@src/shop/product/Attribute.svelte';
    import AttributeList from '@src/shop/product/AttributeList.svelte';
    import Badges from '@src/shop/product/Badges.svelte';
    import { get_detail_attributes } from '@src/shop/product/get_detail_attributes.js';
    import AddToCart from '@src/shop/product/AddToCart.svelte';
    import Wishlist from '@src/shop/wishlist/ToggleButton.svelte';
    import Compare from '@src/shop/compare/ToggleButton.svelte';
    import MediaGallery from '@src/shop/product/MediaGallery.svelte';
    import { get_attribute_value } from '@src/shop/core/attributes.js';

    export let data = null;
    export let locale = null;
    export let currency = null;

    $: product = data?.product;
    $: sku = get_attribute_value(data?.product, 'sku');
    
    const detail_attributes = get_detail_attributes();

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
        <Stock {product} />
        <Price {product} {locale} {currency} />

        <AddToCart {product} />
        <div><Wishlist {sku} /> <Compare {sku} /></div>

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
