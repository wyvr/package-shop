<script>
    import Stylesheet from '@src/wyvr/Stylesheet.svelte';

    export let data;

    onServer(() => {
        setStack('store', data.store);
        setStack('locale', data.locale);
        setStack('currency', data.currency);
    });
</script>

<link rel="icon" href="/assets/favicon.png" />
<Stylesheet src="/assets/global.css" />
{#if data._wyvr.identifier}
    <Stylesheet src="/css/{data._wyvr.identifier}.css" />
{/if}
