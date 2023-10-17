<script>
    import { url_join } from '@src/shop/core/url.mjs';

    export let data;
    const name = injectConfig('shop.name');
    $: title = data.meta?.title || data.meta_title || data.title || name;
    $: description = data.meta?.description || data.meta_description || name;
    $: canonical = url_join(domain, data.url);
    $: robots = data?.robots || injectConfig('env', 'dev') == 'prod' ? 'index, follow' : 'noindex, nofollow';
</script>

<title>{title}</title>
{#if title}
    <meta name="title" content={title} />
    <meta name="og:title" content={title} />
{/if}

{#if description}
    <meta name="description" content={description} />
    <meta name="og:description" content={description} />
{/if}

{#if canonical}
    <link rel="canonical" href={canonical} />
{/if}

{#if robots}
    <meta name="robots" content={robots} />
{/if}

<meta charset="utf-8" />
<meta content="width=device-width,initial-scale=1,minimum-scale=1" name="viewport" />
<meta content="telephone=no" name="format-detection" />
