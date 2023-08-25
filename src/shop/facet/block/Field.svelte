<script>
    import { strip_tags } from '@src/shop/core/sanitize.mjs';

    export let headline;
</script>

<fieldset>
    {#if headline}
        <legend>{@html strip_tags(headline)}</legend>
    {/if}

    <slot />
</fieldset>
