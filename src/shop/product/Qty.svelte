<script>
    import Number from '@src/form/Number.svelte';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let qty;
    export let min = 0;
    export let max = undefined;
    export let step = 1;

    let prev_qty;

    $: change(qty);

    function decrease() {
        update(qty - 1);
    }
    function increase() {
        update(qty + 1);
    }
    function update(value) {
        if (!isNaN(value) && value != null) {
            value = parseInt(value, 10);
            if (max != undefined) {
                value = Math.min(max, value);
            }
            if (min != undefined) {
                value = Math.max(min, value);
            }
            qty = value;
        }
    }
    function change(qty) {
        if (prev_qty == qty) {
            return;
        }
        dispatch('update', {
            qty,
            prev_qty,
        });
        prev_qty = qty;
    }
</script>

<div>
    <button class="decrease" on:click={decrease}>{__('qty.decrease', { count: qty })}</button>
    <Number bind:value={qty} {min} {max} {step} />
    <button class="increase" on:click={increase}>{__('qty.increase', { count: qty })}</button>
</div>

<style>
    div {
        display: flex;
    }
    button {
        width: 3rem;
        padding: 0;
        margin: 0;
        color: var(--color-text-on-primary);
        background: var(--color-primary);
        border: 2px solid var(--color-text);
        text-align: center;
    }
    div :global(input) {
        border-right: 0 !important;
        border-left: 0 !important;
        text-align: center;
        width: 4rem !important;
    }
    div :global(.base) {
        margin-bottom: 0 !important;
    }
    div :global(input) {
        border-radius: 0 !important;
    }
    .decrease {
        border-top-left-radius: calc(var(--size) * 0.25);
        border-bottom-left-radius: calc(var(--size) * 0.25);
    }
    .increase {
        border-top-right-radius: calc(var(--size) * 0.25);
        border-bottom-right-radius: calc(var(--size) * 0.25);
    }
</style>
