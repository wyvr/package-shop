<script>
    import { get_attribute_value } from '../core/attributes.mjs';

    export let product;
</script>

{#if product}
    <h1>{@html get_attribute_value(product, 'name')}</h1>
    <em>{get_attribute_value(product, 'sku')}</em>
{/if}