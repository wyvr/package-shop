<script>
    import { get_attribute_label_of_names } from '@src/shop/core/attributes.js';

    export let name;
    export let product;

    $: value = get_attribute_label_of_names(product, name);
</script>

{#if value}
    {value}
{/if}
