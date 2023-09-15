<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import { get_stock } from '@src/shop/core/product/get_stock.mjs';

    wyvr: {
        render: 'hydrate';
        loading: 'instant';
    }

    export let data;
    export let auto_select_first = true;
    export let pre_selected_options = undefined;

    const dispatch = createEventDispatcher();
    let selected = {};
    let all_selected = false;
    let debouncer;

    $: all_disabled_ids = update_disabled_ids(selected);
    $: set_selected(pre_selected_options);

    onMount(() => {
        data.forEach((option) => {
            selected[option.attribute_code] = false;
        });
        if (auto_select_first) {
            const select_ids = [];

            // options are the different attribute options for the configuration
            data.forEach((option) => {
                if (!Array.isArray(option.values) || option.values.length == 0 || !option.in_stock) {
                    return;
                }
                const attribute_code = option.attribute_code;

                // search the first in_stock attribute value of the option
                const value_in_stock = option.values
                    .filter((option_value) => {
                        return option_value.in_stock;
                    })
                    .find(Boolean);

                if (value_in_stock) {
                    select_ids.push(get_id(attribute_code, value_in_stock.key));
                }
            });
            // select the inputs
            select_inputs(select_ids);
        }
    });

    function set_selected(options) {
        if (options) {
            const select_ids = [];
            Object.entries(options).forEach(([attribute_code, value]) => {
                select_ids.push(get_id(attribute_code, value.key));
            });
            select_inputs(select_ids);
        }
    }

    function select_inputs(select_ids) {
        if (Array.isArray(select_ids) && data.length == select_ids.length) {
            select_ids.forEach((id) => {
                const el = document.getElementById(id);
                el.checked = true;
                el.dispatchEvent(new Event('change'));
            });
        }
    }

    function on_change(event, option, value) {
        selected[option.attribute_code] = value;
        // debounce selected event
        clearTimeout(debouncer);
        debouncer = setTimeout(() => {
            all_selected = Object.values(selected).filter((x) => x).length == data.length;
            if (all_selected) {
                dispatch('selected', selected);
            }
        }, 100);
    }

    function update_disabled_ids(selected) {
        const disabled_ids = [];
        Object.keys(selected).forEach((attribute) => {
            if (!selected[attribute].in_stock && selected[attribute].disable_options) {
                disabled_ids.push(
                    ...Object.keys(selected[attribute].disable_options).map((attribute_code) => {
                        return selected[attribute].disable_options[attribute_code]
                            .map((key) => get_id(attribute_code, key))
                            .filter((x) => x);
                    })
                );
            }
        });
        return disabled_ids.flat(2);
    }
    function get_id(attribute_code, key) {
        return `${attribute_code}_${key}`;
    }
    function in_list(id, list) {
        return list.indexOf(id) > -1;
    }
</script>

{#if data}
    <section>
        {#each data as option}
            <div class="option">
                <b>{option.label}</b>
                <div>
                    {#each option.values as value}
                        {@const id = get_id(option.attribute_code, value.key)}
                        {@const is_disabled = in_list(id, all_disabled_ids)}

                        <input
                            type="radio"
                            name={option.attribute_code}
                            value={value.key}
                            disabled={!value.in_stock || is_disabled}
                            on:change={(ev) => on_change(ev, option, value)}
                            {id}
                        />
                        <label for={id}>{value.title}</label>
                    {/each}
                </div>
            </div>
        {/each}
    </section>
{/if}

<style>
    section {
        margin: 0.5rem 0 1rem;
    }
    .option {
        margin: 0 0 1rem;
    }
    input[type='radio'] {
        clip: rect(0 0 0 0);
        clip-path: inset(100%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
    }
    label {
        display: inline-block;
        border: 2px solid var(--color-text);
        padding: 0.5rem;
        margin: 0.1rem;
        line-height: 1rem;
        cursor: pointer;
        min-width: 50px;
        text-align: center;
        border-radius: 0.3em;
    }
    input[type='radio']:checked + label {
        background-color: var(--color-primary);
        color: var(--color-text-on-primary);
    }
    input[type='radio']:focus + label {
        box-shadow: 0 0 0.3em 0.15em var(--color-primary);
    }
    input[type='radio']:disabled + label {
        pointer-events: none;
        opacity: 0.5;
    }
</style>
