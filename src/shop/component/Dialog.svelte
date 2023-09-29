<script>
    import { onMount } from 'svelte';
    import Id from '@src/shop/stores/id';

    export let open = false;
    export let id = 'dialog';
    export let title = undefined;
    export let description = undefined;
    export let scroll = true;
    export let onKeyDown = undefined;

    let enabled = false;
    let internal_id = '';
    let close;
    let close_content;
    onMount(() => {
        enabled = true;
        internal_id = id + Id();
        
        close_content = close?.innerHTML;

        function handleKeydown(event) {
            if (event.key === 'Escape') {
                open = false;
                return;
            }
            if (typeof onKeyDown === 'function') {
                onKeyDown(event);
            }
        }

        window.addEventListener('keydown', handleKeydown);

        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    });
    $: internal_title_id = title ? internal_id + '_title' : undefined;
    $: internal_desc_id = description ? internal_id + '_desc' : undefined;
</script>

<div style="display:none" bind:this={close}><slot name="close" /></div>
{#if enabled}
    <section
        role="dialog"
        open={open ? true : undefined}
        aria-labelledby={internal_title_id}
        aria-describedby={internal_desc_id}
    >
        <div class="dialog">
            <button
                class="btn close"
                on:click={() => {
                    open = false;
                }}
                >{#if close_content}{@html close_content}{:else}{__('shop.close')}{/if}</button
            >
            {#if title}
                <header id={internal_title_id}>{@html title}</header>
            {/if}
            <div class="content" class:scroll>
                {#if description}
                    <p id={internal_desc_id}>{description}</p>
                {/if}
                <slot />
            </div>
        </div>
        <button
            class="backdrop"
            on:click={() => {
                open = false;
            }}>{__('shop.close')}</button
        >
    </section>
{/if}

<style>
    @import '@src/shop/component/btn.css';
    @import '@src/shop/component/backdrop.css';
    @import '@src/shop/component/dialog.css';

    .dialog .close {
        position: absolute;
        top: 0;
        right: 0;
    }
    header {
        text-align: center;
        padding: 0.5rem;
        font-size: 1.25rem;
    }
    .scroll {
        overflow: auto;
        max-height: 100%;
    }
</style>
