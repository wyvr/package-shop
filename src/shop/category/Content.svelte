<script>
    import Image from '@src/shop/component/Image.svelte';

    export let data;
    $: description = data?.category?.description || ''; // @TODO sanitze html
    $: src = data?.category?.image;
</script>

{#if src}
    <div class="image">
        <Image {src} width={1600} alt={name} sizes={image_sizes} widths={image_widths} />
    </div>
{/if}
{#if description}
    <div class="description">
        {@html description}
    </div>
{/if}
