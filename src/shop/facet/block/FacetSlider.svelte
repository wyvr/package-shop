<script>
    import Field from './Field.svelte';

    export let name = '';
    export let value = undefined;
    export let headline;
    export let list;

    let data;
    let from;
    let to;
    let timer;
    let min;
    let max;

    $: {
        data = get_values(list);
        min = data.min;
        max = data.max;
        if (from == undefined) {
            from = data.min;
        }
        if (to == undefined) {
            to = data.max;
        }
    }

    function update() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            let f_from = parseFloat(from);
            let f_to = parseFloat(to);
            if (isNaN(f_from)) {
                f_from = from;
            }
            if (isNaN(f_to)) {
                f_to = to;
            }
            // when outside the range reset the value
            if (f_from <= min && f_to >= max) {
                value = undefined;
                return;
            }
            value = [f_from, f_to];
        }, 100);
    }

    function get_values(list) {
        const products = {};
        let min = undefined;
        let max = undefined;
        if (!Array.isArray(list)) {
            return { values: [], min, max, products };
        }
        const values = list.map((entry) => {
            const value = parseFloat(entry.value);
            if (min != undefined) {
                min = Math.min(min, value);
            } else {
                min = value;
            }
            if (max != undefined) {
                max = Math.max(max, value);
            } else {
                max = value;
            }
            if (!products[value]) {
                products[value] = [];
            }
            products[value].push(...entry.skus);
            return value;
        });
        return { values, min, max, products };
    }
</script>

<Field {headline}>
    <div>
        <label for="{name}_from">
            {__('facet.from')}
        </label>
        <input id="{name}_from" bind:value={from} on:change={update} />
        <label for="{name}_to">
            {__('facet.to')}
        </label>
        <input id="{name}_to" bind:value={to} on:change={update} />
    </div>
</Field>
