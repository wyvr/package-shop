<script>
    export let entry;
    export let level = 0;
</script>

{#if entry && entry.url}
    <div class="level{level}">
        <a href={entry.url} class="level{level}">{entry.name}</a>
        {#if entry.children && Array.isArray(entry.children) && entry.children.length > 0}
            <nav class="level{level}">
                {#each entry.children as child}
                    <svelte:self entry={child} level={level + 1} />
                {/each}
            </nav>
        {/if}
    </div>
{/if}

<style>
    a {
        display: inline-block;
    }
    nav {
        padding: 5px;
    }
    @media (min-width: 768px) {
        a.level1 {
            padding: 0.5rem;
        }
        nav.level1 {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.1s linear;
            background: var(--color-bg);
            z-index: 10000;
            padding: 1rem;
            box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, var(--opacity-backdrop));
            white-space: nowrap;
            display: flex;
            justify-content: center;
            gap: 1rem;
        }

        div.level1:hover nav.level1 {
            pointer-events: all;
            opacity: 1;
        }

        a.level2 {
            font-weight: 700;
        }
    }
</style>
