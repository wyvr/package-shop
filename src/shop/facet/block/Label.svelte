<script>
    import Count from './Count.svelte';

    export let id;
    export let text;
    export let total;
</script>

<div>
    <slot />
    <label for={id}>{text} <Count value={total} /></label>
</div>
