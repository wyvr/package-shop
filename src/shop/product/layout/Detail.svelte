<script>
    import Name from '@src/shop/product/Name.svelte';
    import Stock from '@src/shop/product/Stock.svelte';
    import Price from '@src/shop/product/Price.svelte';
    import Attribute from '@src/shop/product/Attribute.svelte';
    import AttributeList from '@src/shop/product/AttributeList.svelte';
    import Badges from '@src/shop/product/Badges.svelte';
    import Wishlist from '@src/shop/wishlist/ToggleButton.svelte';
    import Compare from '@src/shop/compare/ToggleButton.svelte';
    import MediaGallery from '@src/shop/product/MediaGallery.svelte';
    import AddToCart from '@src/shop/product/AddToCart.svelte';
    import { get_attribute_value } from '@src/shop/core/attributes.mjs';

    export let product = null;
    export let locale = null;
    export let currency = null;

    const detail_attributes = ['activity', ['style', 'style_bags'], 'material', 'strap_bags', ['features', 'features_bags'], 'gender', 'category_gear'];

    $: sku = get_attribute_value(product, 'sku');
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

        <AddToCart {sku} />
        <Attribute name="description" {product} as_html={true} />

        <div><Wishlist {sku} /> <Compare {sku} /></div>
    </div>
</div>
<div class="details">
    <div>More Information</div>
    <AttributeList attributes={detail_attributes} {product} />
    <slot name="details" />
</div>

<style>
    .name {
        grid-area: product_name;
        margin-bottom: 1em;
    }
    .image {
        grid-area: product_image;
        position: relative;
    }
    .info {
        margin-top: 1em;
        grid-area: product_info;
    }
    @media (min-width: 768px) {
        .main {
            display: grid;
            grid-template-columns: 1fr 2fr;
            grid-template-rows: auto auto;
            gap: 0px 0px;
            grid-template-areas:
                'product_image product_name'
                'product_image product_info';
        }
        .image {
            width: 50%;
            min-width: 300px;
        }
        .info {
            flex-grow: 1;
        }
    }
    .main,
    .details {
        margin-bottom: 2em;
    }
</style>
