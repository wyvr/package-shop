<script>
    import { onMount } from 'svelte';
    import Label from './Label.svelte';
    import Field from './Field.svelte';

    export let name = '';
    export let value = undefined;
    export let headline;
    export let amount = 0;
    export let max = 0;

    let total = undefined;
    let entries = createEntries();

    $: (() => {
        createEntries();
    })(max, amount);

    onServer(init);
    onMount(init);
    
    function init() {
        if (!total && max) {
            total = max;
        }
        entries = createEntries();
    }
    function createEntries() {
        return [
            {
                key: 'all',
                value: undefined,
                total,
            },
            {
                key: 'yes',
                value: true,
                total: amount,
            },
            {
                key: 'no',
                value: false,
                total: max - amount,
            },
        ];
    }

    function onChange(event) {
        try {
            value = JSON.parse(event.currentTarget.value);
        } catch (e) {
            value = undefined;
        }
    }
</script>

<Field {headline}>
    {#each entries as entry}
        <Label id="{name}_{entry.key}" text={__(`facet.${entry.key}`)} total={entry.total}>
            <input
                type="radio"
                checked={value === entry.value}
                on:change={onChange}
                {name}
                id="{name}_{entry.key}"
                value={entry.value}
            />
        </Label>
    {/each}
</Field>
