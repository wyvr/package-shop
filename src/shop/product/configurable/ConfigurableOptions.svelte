<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import { get_stock } from '@src/shop/core/product/get_stock.mjs';

    wyvr: {
        render: 'hydrate';
        loading: 'instant';
    }

    export let data;
    const auto_select_first = true;

    const dispatch = createEventDispatcher();
    let selected = {};
    let all_selected = false;
    $: all_disabled_ids = update_disabled_ids(selected);

    $: {
        all_selected = Object.values(selected).filter((x) => x).length == data.length;
        if (all_selected) {
            dispatch('selected', selected);
        }
    }

    onMount(() => {
        data.forEach((option) => {
            selected[option.attribute_code] = false;
        });
        if (auto_select_first) {
            const avoid_options = {};
            const select_ids = [];
            data.forEach((option) => {
                const attribute_code = option.attribute_code;

                const selected_option = !avoid_options[attribute_code] ? option.values.find(Boolean) : option.values.find(
                    (value) => avoid_options[attribute_code].indexOf(value.key) == -1
                )
                if(selected_option) {
                    if (selected_option?.disable_options) {
                        Object.entries(selected_option?.disable_options).forEach(([attribute, values]) => {
                            avoid_options[attribute] = values;
                        });
                    }
                    select_ids.push(get_id(attribute_code, selected_option.key));
                }
            });
            select_ids.forEach((id) => {
                const el = document.getElementById(id);
                el.checked = true;
                el.dispatchEvent(new Event('change'));
            });
        }
    });

    function onChange(event, option, value) {
        selected[option.attribute_code] = value;
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
                            disabled={!option.in_stock || is_disabled}
                            on:change={(ev) => onChange(ev, option, value)}
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