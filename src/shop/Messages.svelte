<script>
    import { messages } from '@src/shop/stores/messages';
    import Message from '@src/shop/messages/Message.svelte';
    import { slide } from 'svelte/transition';
    import { onMount } from 'svelte';

    wyvr: {
        render: 'hydrate';
        loading: 'instant';
    }
    onMount(() => {
        on('message', (data) => {
            if (data) {
                messages.push(data.message, data.type, data.options);
            }
        });
    });
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
