<script>
    export let data;
</script>

{#if data._wyvr.identifier}
    <script defer src="/js/{data._wyvr.identifier}.js"></script>
{/if}
