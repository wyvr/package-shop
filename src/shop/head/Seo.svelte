<script>
    export let data;

    $: title = data.meta?.title || data.title || _inject('config.shop.name');
</script>

<title>{title}</title>
{#if title}
    <meta name="title" content={title} />
    <meta name="og:title" content={title} />
{/if}

{#if data.meta && data.meta.description}
    <meta content={data.meta.description} name="description" />
{/if}

<meta charset="utf-8" />
<meta content="width=device-width,initial-scale=1,minimum-scale=1" name="viewport" />
<meta content="telephone=no" name="format-detection" />
