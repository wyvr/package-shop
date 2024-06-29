<script>
    import Image from '@src/shop/component/Image.svelte';
    import { trim_text } from '@src/shop/core/sanitize.js';
    import { url_join } from '@src/shop/core/url.js';

    export let category;
    export let store;

    const slug = _inject('config.shop.slug.category', 'category');

    $: link = url_join(store, slug, category.url_path);
</script>

{#if category}
    <a href={link}>
        <Image src={category.image} alt={category.name} width={50} height={50} />
        <span>{@html trim_text(category.name)}</span>
    </a>
{/if}
