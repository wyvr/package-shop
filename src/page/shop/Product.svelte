<script>
    export let data = null;
</script>

{#if data}
    <pre>{JSON.stringify(data, null, 4)}</pre>
{/if}
