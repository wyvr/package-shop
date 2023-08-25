<script>
    import Label from './Label.svelte';
    import { strip_tags } from '@src/shop/core/sanitize.mjs';
    import { createEventDispatcher } from 'svelte';
    import Field from './Field.svelte';

    const dispatch = createEventDispatcher();

    export let name = '';
    export let value = undefined;
    export let headline;
    export let list;
    export let min = 2;

    let real_values = {};
    let details = {};
    let timer;

    $: update_real_values(value);

    function update() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            const data = {};
            let set = false;
            Object.keys(real_values).forEach((key) => {
                if (real_values[key]) {
                    set = true;
                    data[key] = true;
                }
            });
            if (!set) {
                value = undefined;
                details = {};
                dispatch('details', details);
                return;
            }
            value = data;
            details = {};
            const keys = Object.keys(data);
            list.forEach((entry) => {
                if (keys.indexOf(entry.value) > -1) {
                    details[entry.value] = entry;
                }
            });
            dispatch('details', { key: name, details });
        }, 100);
    }

    function update_real_values(value) {
        if (value == undefined) {
            real_values = {};
        }
    }
</script>

{#if list.length >= min}
    <Field {headline}>
        {#each list as entry}
            <Label id="{name}_{entry.value}" text={strip_tags(entry.key)} total={entry.skus.length}>
                <input
                    type="checkbox"
                    bind:checked={real_values[entry.value]}
                    {name}
                    id="{name}_{entry.value}"
                    value={entry.value}
                    on:change={update}
                />
            </Label>
        {/each}
    </Field>
{/if}
