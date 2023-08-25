<script>
    export let text;
</script>

{#if text}
    <span class="hint" title={text}>🯄</span>
{/if}

<style>
    .hint {
        cursor: help;
    }
   
</style>
