<script>
    import { get_badges } from '@src/shop/product/get_badges.js';

    export let product;

    $: badges = get_badges(product);
</script>

{#if badges && get_badges.length > 0}
    <div>
        {#each badges as badge}
            <span style="--badge-color-bg: #333;--badge-color-text: {badge.color || '#fff'}">{badge.name}</span>
        {/each}
    </div>
{/if}

<style>
    div {
        position: absolute;
        display: flex;
        flex-direction: column;
        top: 0.5em;
        left: 0.5em;
    }
    span {
        display: inline-block;
        padding: 0.35em 1em 0.3em;
        margin-bottom: 0.1em;
        font-size: 1rem;
        line-height: 1em;
        letter-spacing: 0.05em;
        font-weight: 700;
        color: var(--badge-color-text);
        background-color: var(--badge-color-bg);
        text-transform: uppercase;
    }
</style>
