<script>
    import Price from '@src/shop/product/Price.svelte';
    import Qty from '@src/shop/product/Qty.svelte';
    import Image from '@src/shop/component/Image.svelte';
    import { get_image_path } from '@src/shop/product/get_image_path.js';
    import { update_qty_delayed, update_qty } from '@src/shop/cart/minicart/item_events';
    import { get_store } from '@src/shop/api-client/get_store';
    import { url_join } from '@src/shop/core/url.js';
    import { get_attribute_value } from '@src/shop/core/attributes.js';

    export let item;
    export let locale;
    export let currency;

    const slug = _inject('config.shop.slug.product', 'product');

    $: image_path = item.thumbnail ? get_image_path(item.thumbnail) : undefined;
    $: link = url_join(get_store(), slug, get_attribute_value(item, 'url_key'));

    function update_qty_event(e) {
        update_qty_delayed(item.sku, e.detail?.qty);
    }
</script>

<div class="item">
    {#if image_path}
        <Image src={image_path} alt={item.name} width={75} height={75} />
    {/if}
    <div class="details">
        <div><a href={link}><b>{@html item.name}</b></a></div>
        <div><em>{item.sku}</em></div>
        <div>{__('cart.item_qty')} <b>{item.qty}</b></div>

        <Price product={item} {locale} {currency} />
        <Qty qty={item.qty} on:update={update_qty_event} />
        <button class="btn" on:click={() => update_qty(item.sku, 0)}>{__('cart_mini.remove')}</button>
    </div>
</div>

<style>
    @import '@src/shop/component/btn.css';

    .item {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    .details {
        flex-grow: 1;
    }
</style>
