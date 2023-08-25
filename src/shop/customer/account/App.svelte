<script>
    import Menu from './Menu.svelte';
    import Account from './Account.svelte';
    import Address from './Address.svelte';
    import Order from './Order.svelte';
    import Compare from './Compare.svelte';

    wyvr: {
        render: 'hydrate';
        loading: 'instant';
    }

    let page = 'account';
</script>

<div class="app">
    <aside>
        <Menu bind:page />
    </aside>
    <section>
        {#if page == 'account'}
            <Account />
        {:else if page == 'address'}
            <Address />
        {:else if page == 'order'}
            <Order />
        {:else if page == 'compare'}
            <Compare />
        {/if}
    </section>
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
    }
    @media (min-width: 768px) {
        .app {
            flex-direction: row;
        }
        aside {
            width: min(30%, 200px);
        }
        section {
            flex-grow: 1;
        }
    }
</style>
