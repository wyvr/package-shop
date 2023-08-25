<script>
    import Image from '@src/wyvr/Image.svelte';
    import { shop_image } from '@src/shop/component/shop_image.mjs';

    export let src;
    export let alt;
    export let width = 0;
    export let height = 0;
    export let format = null;
    export let quality = 60;
    export let sizes = null;
    export let widths = null;
    export let css = null;
    export let lazy = true;
    export let mode = 'cover';
    export let fixed = false;

    const domain = _inject('config.shop.domain');

    $: image_src = shop_image(domain, src);
</script>

{#if image_src}
    <Image src={image_src} {width} {height} {alt} {format} {quality} {sizes} {widths} {css} {lazy} {mode} {fixed} />
{/if}
