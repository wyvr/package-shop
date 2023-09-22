<script>
    import Image from '@src/shop/component/Image.svelte';
    import Dialog from '@src/shop/component/Dialog.svelte';

    export let open = false;
    export let id = 'image-dialog';
    export let images = [];
    export let index = 0;
    export let domain;

    $: internal_images = cleanImages(images);
    $: amount = internal_images.length;
    $: src = internal_images[index]?.src;
    $: label = internal_images[index]?.label;

    function onKeyDown(event) {
        if (event.key === 'ArrowLeft') {
            return prevImage();
        }
        if (event.key === 'ArrowRight') {
            return nextImage();
        }
    }

    function nextImage() {
        index = (index + 1) % internal_images.length;
    }
    function prevImage() {
        index = (index - 1 + internal_images.length) % internal_images.length;
    }
    function cleanImages(list) {
        return list.filter((i) => i && i.src);
    }
</script>

<Dialog {id} bind:open scroll={false} {onKeyDown}>
    <slot slot="close" name="close" />
    <div class="content">
        {#if amount > 1}
            <button class="btn prev" on:click={prevImage}>{__('paging.prev_symbol')}</button>
        {/if}
        <Image {src} {domain} alt={label} width={1200} />
        {#if amount > 1}
            <button class="btn next" on:click={nextImage}>{__('paging.next_symbol')}</button>
        {/if}
        {#if label}
            <div class="label">{label}</div>
        {/if}
        {#if amount > 1}
            <div class="number">{__('paging.x_of_y', { x: index + 1, y: amount })}</div>
        {/if}
    </div>
</Dialog>

<style>
    @import '@src/shop/component/btn.css';

    .content {
        padding-bottom: 0.25rem;
    }
    .content :global(img) {
        max-height: 80vh;
        max-width: 80vw;
        object-fit: contain;
        width: auto;
    }
    .prev,
    .next {
        position: absolute;
        bottom: 0;
    }
    .prev {
        left: 0;
    }
    .next {
        right: 0;
    }
    .label {
        text-align: center;
        padding-top: 0.25rem;
        font-size: 0.8rem;
        line-height: 1em;
    }
    .number {
        text-align: center;
        padding-top: 0.25rem;
        font-size: 0.8rem;
        line-height: 1em;
        opacity: 0.8;
    }
</style>
