<script>
    import Content from '@src/shop/messages/Content.svelte';

    export let message;
</script>

<div><Content message={message.message} /></div>

<style>
    div {
        background-color: lightgreen;
        background-color: var(--color-success);
        color: #000;
        color: var(--color-text-on-primary);
        padding: 0.25em 0.5em;
    }
</style>