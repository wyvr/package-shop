<script>
    import Image from '@src/shop/component/Image.svelte';
    import Error from '@src/shop/Error.svelte';
    import { trim_text } from '@src/shop/core/sanitize.mjs';
    import { get_category_url } from '@src/shop/core/url.mjs';

    export let categories;
    export let store = 'en';
</script>

{#if Array.isArray(categories) && categories.length > 0}
    <section>
        {#each categories as category}
            {@const link = get_category_url(store, category.url_path)}
            <div class="category">
                <div class="image">
                    <a href={link}>
                        <Image src={category.image} alt={category.name} width={100} height={100} />
                    </a>
                </div>
                <div class="content">
                    <div class="name"><a href={link}>{@html trim_text(category.name)}</a></div>
                    <div class="description"><a href={link}>{@html trim_text(category.description, 300)}</a></div>
                </div>
            </div>
        {/each}
    </section>
{:else}
    <Error text={__('search.nothing_found')} />
{/if}
