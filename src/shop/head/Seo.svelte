<script>
    export let data;
</script>

<title>{data.meta?.title || data.title}</title>

{#if data.meta && data.meta.description}
    <meta content={data.meta.description} name="description" />
{/if}

<meta charset="utf-8" />
<meta content="width=device-width,initial-scale=1,minimum-scale=1" name="viewport" />
<meta content="telephone=no" name="format-detection" />
