<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let tags = [];

    function click(tag) {
        if (!tag) {
            dispatch('change', {
                list: [],
                removed: undefined,
            });
            return;
        }
        let list = tags.filter((x) => x);
        if ((tag, typeof tag == 'string')) {
            list = list.filter((x) => x.id != tag);
        }
        dispatch('change', {
            list,
            removed: tag,
        });
    }

    function get_tag_details(tag) {
        if (!tag.details) {
            return '';
        }
        // range
        if (Array.isArray(tag.details)) {
            return tag.details.join(',');
        }
        const keys = Object.keys(tag.details)
            .map((id) => tag.details[id]?.key)
            .filter((x) => x);
        return keys.join(', ');
    }
</script>

<section>
    {#if tags && tags.length > 0}
        {#each tags as tag}
            {@const details = get_tag_details(tag)}
            <button
                on:click={() => {
                    click(tag.id);
                }}
            >
                {#if tag.details === false}
                    {__('facet.not_key', { key: tag.name })}
                {:else}
                    {tag.name}
                {/if}
                <span>{details}</span>
            </button>
        {/each}
        <button
            on:click={() => {
                click();
            }}>{__('facet.clear')}</button
        >
    {/if}
</section>
