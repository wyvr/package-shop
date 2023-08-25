<script>
    import { messages } from '@src/shop/stores/messages';
    import Message from '@src/shop/messages/Message.svelte';
    import { slide } from 'svelte/transition';

    wyvr: {
        render: 'hydrate';
        loading: 'instant';
    }
</script>

{#if $messages}
    <section class="messages">
        {#each $messages as message}
            <div transition:slide>
                <Message {message} />
            </div>
        {/each}
    </section>
{/if}
