<script>
    import Account from '@src/shop/customer/Account.svelte'
    export let data = null;
</script>

<h1>{data.title}</h1>

{#if data.content}
    <div>
        {@html data.content}
    </div>
{/if}

<Account store={data.store?.key} />
