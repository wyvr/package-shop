<script>
    export let page;

    const pages = [
        {
            id: 'account',
            title: __('customer_menu.account'),
        },
        {
            id: 'address',
            title: __('customer_menu.address'),
        },
        {
            id: 'order',
            title: __('customer_menu.order'),
        },
        {
            id: 'compare',
            title: __('customer_menu.compare'),
        },
    ];
</script>

<nav>
    {#each pages as data}
        {#if page == data.id}
            <div>{data.title}</div>
        {:else}
            <button type="button" on:click={() => (page = data.id)} class:active={page == data.id}>
                {data.title}
            </button>
        {/if}
    {/each}
</nav>

<style>
    nav {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        justify-content: stretch;
    }
    button,
    div {
        text-align: center;
        font-size: 1rem;
        line-height: 1.4em;
        border: none;
        background-color: transparent;
        color: var(--color-text);
        padding: 0;
        flex-grow: 1;
        min-width: fit-content;
    }
    div {
        font-weight: 700;
    }
    button {
        cursor: pointer;
    }
    @media (min-width: 768px) {
        nav {
            flex-direction: column;
        }
        button,
        div {
            text-align: left;
        }
    }
</style>
