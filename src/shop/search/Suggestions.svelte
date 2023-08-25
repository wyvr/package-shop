<script>
    export let suggestions;

    $: entries = get_suggestions(suggestions);

    function get_suggestions(data) {
        if (!Array.isArray(data) || data.length == 0) {
            return undefined;
        }
        const entries = data
            .map((entry) => {
                if (entry.options.length == 0) {
                    return undefined;
                }
                return entry.options.map((option) => option.text);
            })
            .filter((x) => x);
        if (entries.length == 0) {
            return undefined;
        }
        return entries;
    }
</script>

{#if entries}
    <section>
        {__('search.suggestion')}
        {#each entries as entry}
            <span>{entry.join(', ')}</span>
        {/each}
    </section>
{/if}
