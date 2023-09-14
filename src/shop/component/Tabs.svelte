<script>
    import { createEventDispatcher, onMount } from 'svelte';

    export let tabs;
    export let id;
    export let selected_index = 0;

    const dispatcher = createEventDispatcher();

    function select(index) {
        selected_index = index;
        dispatcher('change', { tab: tabs[index], index });
    }
</script>

{#if tabs}
    <section {id}>
        <header>
            {#each tabs as tab, index}
                {#if index == selected_index}
                    <span>{tab.title}</span>
                {:else}
                    <button
                        on:click={() => {
                            select(index);
                        }}>{tab.title}</button
                    >
                {/if}
            {/each}
        </header>
        <div class="tabs">
            <slot />
        </div>
        <slot name="content" />
    </section>
{/if}
