<script>
    import Compare from '@src/shop/compare/App.svelte'
    export let data = null;
</script>

<h1>{data.title}</h1>

{#if data.content}
    <div>
        {@html data.content}
    </div>
{/if}

<Compare store={data.store?.key} locale={data.locale} currency={data.currency?.default} />
