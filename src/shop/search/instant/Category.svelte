<script>
    import Image from '@src/shop/component/Image.svelte';
    import { trim_text } from '@src/shop/core/sanitize.mjs';
    import { get_category_url } from '@src/shop/core/url.mjs';

    export let category;
    export let store;

    $: link = get_category_url(store, category.url_path);
</script>

{#if category}
    <a href={link}>
        <Image src={category.image} alt={category.name} width={50} height={50} />
        <span>{@html trim_text(category.name)}</span>
    </a>
{/if}
