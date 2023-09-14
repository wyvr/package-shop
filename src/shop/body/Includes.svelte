<script>
    export let data;

    onServer(() => {
        setStack('store', data.store);
        setStack('locale', data.locale);
        setStack('currency', data.currency);
    });
</script>

{#if data._wyvr.identifier}
    <script defer src="/js/{data._wyvr.identifier}.js"></script>
{/if}
