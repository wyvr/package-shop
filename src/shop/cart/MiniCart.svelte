<script>
    import { cart } from '@src/shop/stores/cart';

    import Header from '@src/shop/cart/minicart/Header.svelte';
    import Footer from '@src/shop/cart/minicart/Footer.svelte';
    import Item from '@src/shop/cart/minicart/Item.svelte';

    export let locale;
    export let currency;

    $: items = get_items($cart);
    $: count = items.reduce((acc, item) => acc + item.qty, 0);
    $: sum = items.reduce((acc, item) => acc + item.final_price * item.qty, 0);

    function get_items(cart) {
        if (!cart?.items) {
            return [];
        }
        return cart.items;
    }
</script>

{#if items.length > 0}
    <section class="minicart">
        <header>
            <Header {count} {sum} {locale} {currency} />
        </header>
        <div>
            {#each items as item (item.sku)}
                <Item {item} {locale} {currency} />
            {/each}
        </div>
        <footer>
            <Footer />
        </footer>
    </section>
{:else}
    <p>{__('cart.empty')}</p>
{/if}

<style>
    .minicart {
        display: flex;
        height: 100%;
        flex-direction: column;
        width: 80vw;
        max-width: 500px;
    }
    .minicart div {
        flex-grow: 1;
        padding: 1rem;
        overflow-y: auto;
    }
    .minicart header {
        padding: 1rem;
        border-bottom: 1px solid var(--color-text);
    }
    .minicart footer {
        padding: 1rem;
        padding-bottom: 3rem;
        border-top: 1px solid var(--color-text);
    }
</style>
