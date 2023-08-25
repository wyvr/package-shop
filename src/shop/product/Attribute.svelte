<script>
    import { get_attribute_name_of_names } from '../core/attributes.mjs';

    export let name;
    export let product;
    export let as_html = false;

    $: value = get_attribute_name_of_names(product, name);

    function to_html(value) {
        if(typeof value != 'string') {
            return '';
        }
        return value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/(<\/?)\s*script/g, '$1data-script')
    }
</script>

{#if value && value.value}
    {#if as_html}
        {@html to_html(value.value)}
    {:else}
        {value.value}
    {/if}
{/if}
