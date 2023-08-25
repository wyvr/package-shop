<script>
    import EmptyListItem from '@src/shop/product/EmptyListItem.svelte';
    import ListItem from '@src/shop/product/ListItem.svelte';
    import { onMount } from 'svelte';
    import { register } from 'swiper/element/bundle';

    wyvr: {
        render: 'hydrate';
    }

    // register swiper slider
    register();

    export let title = null;
    export let show_pager = true;
    export let products_per_page = 5;
    export let products = [];
    export let store_key;
    export let locale = 'en';
    export let currency = 'EUR';
    export let breakpoints;
    let slidesPerView = 1;

    onServer(() => {
        slidesPerView = products_per_page;
    });
    onMount(() => {
        breakpoints = getBreakpoints();
    });
    function getBreakpoints() {
        return {
            400: {
                slidesPerView: Math.max(1, Math.ceil(products_per_page / 4)),
            },
            500: {
                slidesPerView: Math.max(1, Math.ceil(products_per_page / 3)),
            },
            600: {
                slidesPerView: Math.max(1, Math.ceil(products_per_page / 2.5)),
            },
            768: {
                slidesPerView: Math.max(1, Math.ceil(products_per_page / 2)),
            },
            1024: {
                slidesPerView: Math.max(1, Math.ceil(products_per_page / 1.5)),
            },
            1280: {
                slidesPerView: products_per_page,
            },
        };
    }
</script>

{#if products && products.length > 0}
    <section>
        {#if title}
            <header>
                {title}
            </header>
        {/if}
        <swiper-container slides-per-view={slidesPerView} centered-slides={false} pagination={show_pager} {breakpoints}>
            {#each products as product}
                <swiper-slide>
                    <div class="slide">
                        {#if product}
                            <ListItem {product} store={store_key} {locale} {currency} />
                        {:else}
                            <EmptyListItem />
                        {/if}
                    </div>
                </swiper-slide>
            {/each}
        </swiper-container>
    </section>
{/if}

<style>
    section {
        margin-bottom: 1rem;
        position: relative;
        margin-left: -1rem;
        margin-right: -1rem;
        --swiper-pagination-bottom: 0;
        --swiper-pagination-color: var(--color-primary);
        --swiper-pagination-bullet-inactive-color: var(--color-text);
    }
    section::before,
    section::after {
        content: '';
        width: 1rem;
        position: absolute;
        top: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 100;
    }
    section::before {
        left: 0;
        background-image: linear-gradient(90deg, var(--color-bg), transparent);
    }
    section::after {
        right: 0;
        background-image: linear-gradient(-90deg, var(--color-bg), transparent);
    }
    header {
        font-weight: 700;
        margin-left: 1rem;
        margin-right: 1rem;
    }
    .slide {
        margin-right: 1rem;
        margin-left: 1rem;
        margin-bottom: 30px;
    }
</style>
