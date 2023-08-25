<script>
    import Error from '@src/shop/messages/Error.svelte';
    import Info from '@src/shop/messages/Info.svelte';
    import Success from '@src/shop/messages/Success.svelte';
    import Warning from '@src/shop/messages/Warning.svelte';
    import { messages } from '@src/shop/stores/messages';

    export let message;

    function close() {
        messages.close(message.id)
    }
</script>

<div data-message-id={message.id}>
    {#if message.type == 'info'}
        <Info {message} />
    {:else if message.type == 'warning'}
        <Warning {message} />
    {:else if message.type == 'error'}
        <Error {message} />
    {:else if message.type == 'success'}
        <Success {message} />
    {/if}
    {#if !message.destroy_in}
        <button class="close" on:click={close}>{__('shop.close')}</button>
    {/if}
</div>

<style>
    div {
        position: relative;
        margin-bottom: 1px;
    }
    button {
        position: absolute;
        right: 0.25em;
        top: 0.25em;
        background-color: transparent;
        border: 1px solid #000;
        border-color: var(--color-text-on-primary);
        padding: 0.25em;
        color: #000;
        color: var(--color-text-on-primary);
        cursor: pointer;
    }
</style>
