<script>
    import { trim_text } from '@src/shop/core/sanitize.js';
    import { url_join } from '@src/shop/core/url.js';

    export let page;
    export let store = 'en';

    $: link = url_join(store, page?.identifier);
</script>

{#if page}
    <a href={link}>{@html trim_text(page.content_heading)}</a>
{/if}
