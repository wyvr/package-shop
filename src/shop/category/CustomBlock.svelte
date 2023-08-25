<script>
    export let name;
    // export let position;
    // export let product;
</script>

<div><span>{@html __('category.custom_block', { name })}</span></div>

<style>
    div {
        background: var(--color-primary);

        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    span {
        display: block;
        text-align: center;
    }
</style>
