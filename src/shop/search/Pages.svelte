<script>
    import Error from '@src/shop/Error.svelte';
    import { trim_text } from '@src/shop/core/sanitize.mjs';
    import { url_join } from '@src/shop/core/url.mjs';

    export let pages;
    export let store = 'en';

    //        home = await get(store_id, 'web.default.cms_home_page', 'search_page');
</script>

{#if Array.isArray(pages) && pages.length > 0}
    <section>
        {#each pages as page}
            {@const link = url_join(store, page.identifier)}

            <div class="page">
                <a href={link}>{@html trim_text(page.content_heading)}</a>
                {#if page.meta_description}
                    <span>{trim_text(page.meta_description)}</span>
                {/if}
            </div>
        {/each}
    </section>
{:else}
    <Error text={__('search.nothing_found')} />
{/if}
