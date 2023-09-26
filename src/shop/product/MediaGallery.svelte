<script>
    import Image from '@src/shop/component/Image.svelte';
    import MagnifyImage from '@src/shop/component/MagnifyImage.svelte';
    import { get_attribute_value } from '../core/attributes.mjs';
    import { get_image_path } from './get_image_path.mjs';
    import { onMount } from 'svelte';
    import { register } from 'swiper/element/bundle';
    import ImageDialog from '@src/shop/component/ImageDialog.svelte';

    wyvr: {
        render: 'hydrate';
        loading: 'lazy';
    }

    // register swiper slider
    register();

    export let product;
    export let additional_product = null;

    let images = get_images(product);
    $: {
        images = get_images(product);
    }

    const image_main_widths = [500, 450, 400, 350, 300, 600, 500, 400, 300];
    const image_main_sizes = [1500, 1350, 1200, 1024, 768, 600, 500, 400, null]
        .map((screen_width, index) => {
            const width = image_main_widths[index];
            if (index + 1 == image_main_widths.length) {
                return width;
            }
            return `(min-width: ${screen_width}px) ${width}px`;
        })
        .join(', ');

    let selected_image;
    let selected_index = 0;
    let open = false;

    function get_images(product) {
        if (!product) {
            return [];
        }
        const sources = [];
        return Object.values(get_attribute_value(product, 'media_gallery')?.images || {})
            .map((image) => {
                const src = get_image_path(image.file);
                // allow sources only once
                if (sources.indexOf(src) > -1) {
                    return undefined;
                }
                image.src = src;
                sources.push(src);
                return image;
            })
            .filter((x) => x);
    }
    function select(image, index) {
        selected_image = image;
        if (index != undefined) {
            selected_index = index;
        }
        select_main_image(selected_index);
    }
    function select_main_image(index) {
        // avoid out of range images
        if (index < 0 || index >= images.length) {
            index = 0;
        }
        selected_index = index;
        selected_image = images[index];
    }
    function open_selected_image() {
        open = true;
    }

    onServer(async () => {
        images = get_images(product);
        select_main_image(selected_index);
    });
    onMount(() => {
        select_main_image(selected_index);

        on('shop-product-switch', (switch_product) => {
            additional_product = switch_product;
            const product_images = get_images(product);
            // remove first image of the original product
            const reversed_images = [].concat(get_images(additional_product), product_images.slice(1)).reverse();
            const reversed_image_files = reversed_images.map((i) => i.file);
            images = reversed_images
                .filter((image, index) => reversed_image_files.indexOf(image.file) == index)
                .reverse();
            // select the previous selected index image
            select_main_image(selected_index);
        });
    });
</script>

{#if product}
    <section>
        {#if selected_image}
            <div class="selected">
                <MagnifyImage
                    src={selected_image.src}
                    width={600}
                    maxWidth={1200}
                    alt={selected_image.label}
                    sizes={image_main_sizes}
                    widths={image_main_widths}
                    on:click={open_selected_image}
                />
            </div>
        {/if}
        {#if images.length > 1}
            <div class="previews">
                {#each images as image, i}
                    <button on:click={() => select(image, i)} class:active={i == selected_index}>
                        <Image src={image.src} width={100} height={100} alt={image.label} />
                    </button>
                {/each}
            </div>
        {/if}
        <ImageDialog bind:open {images} index={selected_index} />
    </section>
{/if}

<style>
    section {
        --swiper-pagination-bottom: 0;
        --swiper-pagination-color: var(--color-primary);
        --swiper-pagination-bullet-inactive-color: var(--color-text);
    }
    section :global(picture) {
        margin: 0;
        padding: 0;
        display: block;
    }
    section :global(img) {
        display: block;
        margin: 0 auto;
        /*max-width: 100%;*/
    }
    .selected {
        margin-bottom: 0.25rem;
    }
    .selected :global(img) {
        max-width: 100%;
    }

    .previews {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 0.25rem;
        gap: 0.25rem;
        justify-content: center;
    }
    .previews :global(img) {
        aspect-ratio: 1 / 1;
    }
    .previews button {
        margin: 0;
        padding: 0;
        display: block;
        border: 0;
        cursor: pointer;
        background: transparent;
        transition: transform 0.1s ease-out, opacity 0.1s linear;
        position: relative;
    }
    .previews button:before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transition: opacity 0.1s linear;
        opacity: 0;
        background-color: var(--color-primary);
        mix-blend-mode: multiply;
    }
    .previews button.active {
        cursor: default;
        pointer-events: none;
    }
    .previews button.active:before {
        opacity: 0.75;
    }
    /* .dialog :global(img) {
        max-width: 1200px;
        width: 100%;
    } */
</style>
