<script>
    import Script from '@src/wyvr/Script.svelte';

    export let data;
</script>

{#if data._wyvr.identifier}
    <Script src="/js/{data._wyvr.identifier}.js" />
{/if}
