<script>
import { get_attributes_of_names } from '@src/shop/core/attributes.js';

    export let attributes;
    export let product;

    $: list = Array.isArray(attributes)
        ? attributes.map((name) => get_attributes_of_names(product, name)).filter((x) => x)
        : [];
</script>

{#if list && list.length > 0}
    <ul>
        {#each list as attribute}
            {#if attribute.length > 0}
                <li><b>{attribute[0].label}</b> <span>{attribute[0].name}</span></li>
            {/if}
        {/each}
    </ul>
{/if}
