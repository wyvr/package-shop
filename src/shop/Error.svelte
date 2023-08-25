<script>
    export let headline = null;
    export let text = null;
</script>

<div class="error">
    {#if headline}
        <div class="headline">{headline}</div>
    {/if}
    {#if text}
        <div class="text">{@html text}</div>
    {/if}
</div>

<style>
    .error {
        background-color: #a00;
        color: #fff;
        padding: 1em;
        margin-bottom: 1em;
        border-radius: 0.3em;
    }
    .headline {
        font-size: 2em;
        padding-bottom: 1em;
    }
</style>
