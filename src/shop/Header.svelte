<script>
    import Logo from '@src/shop/Logo.svelte';
    import Search from '@src/shop/header/Search.svelte';
    import Customer from '@src/shop/header/Customer.svelte';
    import Cart from '@src/shop/header/Cart.svelte';
    import Navigation from '@src/shop/header/Navigation.svelte';
    import Wishlist from '@src/shop/header/Wishlist.svelte';
    import Compare from '@src/shop/header/Compare.svelte';

    export let title = '';
    export let store = null;
    export let locale;
    export let currency;
</script>

<header>
    <section>
        <div class="logo">
            <Logo store={store?.key} name={title} />
        </div>
        <div class="other">
            <Search store={store?.key} />
            <slot />
            <Customer store={store?.key} />
            <Compare store={store?.key} />
            <Wishlist store={store?.key} />
            <Cart store={store?.key} {locale} {currency} />
        </div>
    </section>
    <div class="nav">
        <Navigation store={store?.key} />
    </div>
</header>

<style>
    header {
        padding-bottom: 1em;
    }
    .other {
        text-align: right;
        display: flex;
        flex-direction: row;
        justify-content: end;
        gap: 0.5rem;
    }
    .other :global(> *) {
        text-align: left;
    }
    @media (min-width: 768px) {
        section {
            display: flex;
            flex-direction: row;
            align-items: center;
        }
        .logo {
            padding-right: 1em;
        }
        .other {
            flex-grow: 1;
        }
    }
</style>
