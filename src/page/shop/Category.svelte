<script>
    import Filter from '@src/shop/category/Filter.svelte';
    import Error from '@src/shop/Error.svelte';
    import Content from '@src/shop/category/Content.svelte';

    export let data = null;

    $: valid = !!data?.category;
    $: name = data?.category?.name || '';
    $: products = data?.category?.products || [];

    const check_page_script = `<script>
        if(document.location.hash) {
            let interact_elems = Array.from(document.querySelectorAll('.trigger_interact [data-hydrate][data-loading="interact"]'));
            const interact_watcher = setInterval(function() {
                interact_elems = interact_elems.filter(function(el) {
                    if(el.getAttribute('data-bind-interact') == 'true') {
                        el.dispatchEvent(new Event('interact'));
                        return false;
                    }
                    return true;
                });
                if(interact_elems.length == 0) {
                    clearInterval(interact_watcher);
                }
            }, 250)
        }
    <\/script>
    `;

    const image_widths = [1600, 1500, 1400, 1300, 1200, 1100, 1000, 900, 800, 700, 600, 500, 400, 350];
    const image_sizes = image_widths
        .map((width, index) => {
            if (index + 1 == image_widths.length) {
                return width;
            }
            return `(min-width: ${width + 50}px) ${width}px`;
        })
        .join(', ');
</script>

{#if valid}
    <div class="main">
        <h1>{name}</h1>
    </div>

    <Content {data} />
    <div class="details trigger_interact">
        <Filter {products} store={data.store.key} {name} locale={data.locale} currency={data.currency.default} />
    </div>
    <div>{@html check_page_script}</div>
    <!-- <pre>{JSON.stringify(data?.category, null, 4)}</pre> -->
{:else}
    <Error text={__('category.error_loading')} />
{/if}

<style>
    .main,
    .details {
        margin-bottom: 2em;
    }
    .image :global(img) {
        width: 100% !important;
        height: auto !important;
        display: block;
    }
    .description {
        margin-bottom: 0.5rem;
    }
</style>
