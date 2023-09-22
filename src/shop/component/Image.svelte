<script>
    import { onMount } from 'svelte';
    import Image from '@src/wyvr/Image.svelte';

    export let src;
    export let domain;
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

    let config;
    let domain_hash;
    onServer(async () => {
        if (domain) {
            domain_hash = domain;
            return;
        }
        if (!config) {
            const { Config } = await import('@wyvr/generator/src/utils/config.js');
            config = Config;
        }
        const { get_domain_hash } = await import('@wyvr/generator/src/utils/media.js');
        domain_hash = get_domain_hash(config.get('media.allowed_domains.shop'));
    });
    onMount(() => {
        if (!domain) {
            domain = _media.shop;
        }
        domain_hash = domain;
    });
</script>

{#if src}
    <Image
        {src}
        domain={domain_hash}
        {width}
        {height}
        {alt}
        {format}
        {quality}
        {sizes}
        {widths}
        {css}
        {lazy}
        {mode}
        {fixed}
    />
{/if}
