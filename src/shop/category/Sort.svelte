<script>
    import category_sort_options from '@src/shop/config/category_sort_options.js';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let sort_by = 'position';
    export let asc = true;

    function toggleAsc() {
        asc = !asc;
    }
</script>

<section>
    <select bind:value={sort_by} on:change={() => dispatch('change', sort_by)}>
        {#each category_sort_options as option}
            <option value={option}>{__('category_sort.' + option)}</option>
        {/each}
    </select>
    <button on:click={toggleAsc} title={__(asc ? 'category_sort.asc' : 'category_sort.desc')}>
        {__(asc ? 'category_sort.asc_symbol' : 'category_sort.desc_symbol')}
    </button>
</section>
