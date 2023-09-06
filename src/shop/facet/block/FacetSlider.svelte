<script>
    import Field from './Field.svelte';
    import RangeSlider from '@src/vendor/svelte-range-slider-pips/RangeSlider.svelte';
    import { get_values_from_products } from '@src/shop/facet/block/slider_helper.js';

    export let name = '';
    export let value = undefined;
    export let headline;
    export let list;
    export let step = 1;
    export let unit;

    let data;
    let from;
    let to;
    let timer;
    let min;
    let max;
    let slider_values = [0, 1];

    // used primarily to reset the values
    $: update_values(value);

    // when the products change, also update the limits
    $: update_limits(list);

    // debounce and update all values
    function update() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            let f_from = parseFloat(from);
            let f_to = parseFloat(to);
            if (isNaN(f_from)) {
                f_from = min;
                from = min;
            }
            if (isNaN(f_to)) {
                f_to = max;
                to = max;
            }
            // when outside the range reset the value
            if (f_from <= min && f_to >= max) {
                slider_values = [min, max];
                value = undefined;
                return;
            }
            value = [f_from, f_to];
            slider_values = [f_from, f_to];
        }, 100);
    }

    function update_limits(list) {
        data = get_values_from_products(list);
        if (step >= 1) {
            data.min = Math.floor(data.min);
            data.max = Math.ceil(data.max);
        } else {
            data.min = Math.floor(data.min * 10) / 10;
            data.max = Math.ceil(data.max * 10) / 10;
        }
        min = data.min;
        max = data.max;
        if (from == undefined) {
            from = data.min;
        }
        if (to == undefined) {
            to = data.max;
        }
        const new_value = [].concat([from, to]);
        slider_values = new_value;
        if (value && (value[0] != new_value[0] || value[1] != new_value[1])) {
            value = new_value;
        }
    }

    function update_slider(values) {
        if (values && values.length >= 2 && (from != values[0] || to != values[1])) {
            from = values[0];
            to = values[1];
            update();
        }
    }

    function update_values(values) {
        if (value == undefined) {
            slider_values = [].concat([min, max]);
            from = min;
            to = max;
        }
    }
</script>

<Field {headline}>
    {#if slider_values}
        <RangeSlider
            range
            pips
            values={slider_values}
            {min}
            {max}
            {step}
            on:change={(e) => update_slider(e.detail?.values)}
        />
    {/if}
    <div class="inputs">
        <div class="field from">
            <label for="{name}_from">
                {__('facet.from')}
            </label>
            <input id="{name}_from" bind:value={from} on:change={update} /><span class="unit">{unit}</span>
        </div>
        <div class="field to">
            <label for="{name}_to">
                {__('facet.to')}
            </label>
            <input id="{name}_to" bind:value={to} on:change={update} /><span class="unit">{unit}</span>
        </div>
    </div>
</Field>
