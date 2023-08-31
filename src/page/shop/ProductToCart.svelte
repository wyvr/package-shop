<script>
    import App from '@src/shop/product_to_cart/App.svelte'
    export let data = null;
</script>

<h1>{data.title}</h1>

{#if data.content}
    <div>
        {@html data.content}
    </div>
{/if}

<App store={data.store?.key} />
