<script>
    import Wishlist from '@src/shop/wishlist/App.svelte'
    export let data = null;
</script>

<h1>{data.title}</h1>

{#if data.content}
    <div>
        {@html data.content}
    </div>
{/if}

<Wishlist store={data.store?.key} locale={data.locale} currency={data.currency?.default} />
