<script>
    import InlineSpinner from '@src/shop/component/InlineSpinner.svelte';

    export let size = '2rem';
    export let speed = '0.75s';
    export let color = 'var(--color-text)';
    export let stroke = '0.15rem';
</script>

<div>
    <InlineSpinner {size} {speed} {color} {stroke} />
</div>

<style>
    div {
        text-align: center;
    }
</style>
