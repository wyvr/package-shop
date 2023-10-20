<script>
    import Image from '@src/wyvr/Image.svelte';
    import { url_join } from '@src/shop/core/url.mjs';

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

    $: media_src = get_src(src);

    const domain = _inject('config.media.allowed_domains.shop');

    function get_src(src) {
        if(!src) {
            return undefined;
        }
        if (src.indexOf('http') == 0) {
            return src;
        }

        const url = url_join(domain, src);
        return url;
    }
</script>

{#if media_src}
    <Image src={media_src} {width} {height} {alt} {format} {quality} {sizes} {widths} {css} {lazy} {mode} {fixed} />
{/if}
