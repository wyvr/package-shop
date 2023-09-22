<script>
    import Image from '@src/shop/component/Image.svelte';
    import { onMount } from 'svelte';

    wyvr: {
        render: 'hydrate';
        loading: 'lazy';
    }

    export let maxWidth = 1000;
    export let src;
    export let domain;
    export let alt;
    export let width = 0;
    export let sizes = null;
    export let widths = null;
    export let centered = true;

    let started = false;

    let container;
    let preview;

    let position = '--x: 0px; --y: 0px;';
    onMount(() => {
        started = true;
    });

    function move(event) {
        if (!preview) {
            console.warn('preview is not available');
            return;
        }
        const previewImage = preview.querySelector('img');
        if (!container) {
            console.warn('container is not available');
            return;
        }
        const magnifiedImage = container.querySelector('img');
        if (!magnifiedImage) {
            console.warn('magnified image is not available');
            return;
        }

        const bounds = previewImage.getBoundingClientRect();

        const magnifiedWidth = magnifiedImage.width;

        const previewWidth = bounds.width;
        const previewHeight = bounds.height;

        const scale = previewWidth / magnifiedWidth;

        const miniWidth = Math.ceil(previewWidth * scale);
        const miniHeight = Math.ceil(previewHeight * scale);

        const outlineX = miniWidth / 2;
        const outlineY = miniHeight / 2;

        const mouseX = event.clientX - bounds.x;
        const mouseY = event.clientY - bounds.y;

        const X = Math.min(Math.max(0, mouseX - outlineX), previewWidth - miniWidth);
        const Y = Math.min(Math.max(0, mouseY - outlineY), previewHeight - miniHeight);

        position = `--x: -${X / scale}px; --y: -${Y / scale}px;`;
    }
</script>

<section on:mousemove={move} class:centered>
    <button bind:this={preview} class="preview" on:click>
        <Image {src} {domain} {width} {alt} {sizes} {widths} />
    </button>
    {#if started}
        <div bind:this={container} class="magnified" style={position}>
            <Image {src} {domain} width={maxWidth} alt={''} />
        </div>
    {/if}
</section>

<style>
    section {
        position: relative;
        width: fit-content;
    }
    .centered {
        margin: 0 auto;
    }
    button {
        margin: 0;
        padding: 0;
        border: 0;
        border-radius: 0;
        background: none;
        cursor: zoom-in;
        display: block;
        width: fit-content;
    }
    .magnified {
        --x: 0;
        --y: 0;
        position: absolute;
        opacity: 0;
        pointer-events: none;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
        transition: opacity 0.2s linear;
    }
    .magnified :global(img) {
        transition: transform 0.1s ease;
    }
    section:hover .magnified {
        opacity: 1;
    }
    .magnified :global(img) {
        max-width: inherit;
        transform: translate(var(--x), var(--y));
    }
</style>
