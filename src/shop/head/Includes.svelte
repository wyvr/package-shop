<script>
    import Stylesheet from '@src/wyvr/Stylesheet.svelte';

    export let data;
</script>

<link rel="icon" href="/assets/favicon.png" />
<Stylesheet src="/assets/global.css" />
{#if data._wyvr.identifier}
    <Stylesheet src="/css/{data._wyvr.identifier}.css" />
{/if}
