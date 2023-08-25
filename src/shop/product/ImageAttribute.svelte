<script>
    import Image from '@src/shop/component/Image.svelte';
    import { get_attribute_value, get_attribute_label } from '../core/attributes.mjs';
    import { get_image_path } from './get_image_path.mjs';

    export let name;
    export let product;
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

    $: value = get_attribute_value(product, name);
    $: src = get_image_path(value);
    $: alt = get_attribute_label(product, 'name') || '';
</script>

{#if value && src}
    <Image {src} {width} {height} {alt} {format} {quality} {sizes} {widths} {css} {lazy} {mode} {fixed} />
{/if}
