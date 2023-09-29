<script>
    import Script from '@src/wyvr/Script.svelte';

    export let data;

    onServer(() => {
        setStack('store', data.store);
        setStack('locale', data.locale);
        setStack('currency', data.currency);
    });
</script>

{#if data._wyvr.identifier}
    <Script src="/js/{data._wyvr.identifier}.js" />
{/if}
