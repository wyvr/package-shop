<script>
    import { cart } from '@src/shop/stores/cart';
    import MiniCart from '@src/shop/cart/MiniCart.svelte';
    import Badge from '@src/shop/component/Badge.svelte';

    wyvr: {
        render: 'hydrate';
        loading: 'instant';
    }

    export let locale;
    export let currency;

    $: count = get_count($cart);

    function get_count(cart) {
        if (!cart || !cart.items) {
            return 0;
        }
        return Object.values(cart.items).reduce((acc, item) => acc + item.qty, 0);
    }
</script>

<section>
    <label title={__('cart.name')} for="cart-toggle">🛒<Badge>{count}</Badge></label>

    <input type="checkbox" id="cart-toggle" />
    <div class="cart">
        <label class="btn" for="cart-toggle">{__('shop.close')}</label>
        <MiniCart {locale} {currency} />
    </div>
</section>

<style>
    @import '@src/shop/component/btn.css';
    section {
        height: 100%;
        display: flex;
        align-items: center;
    }
    label {
        font-size: 20px;
        padding: 0.4rem;
        color: var(--color-primary);
        cursor: pointer;
        position: relative;
    }
    input {
        position: fixed !important;
        appearance: none !important;
        background: transparent;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        border: 0;
        padding: 0;
        margin: 0;
        pointer-events: none;
        cursor: pointer;
    }
    input:checked {
        background: rgba(0, 0, 0, var(--opacity-backdrop));
        pointer-events: all;
    }
    .cart {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.1s linear, transform 0.4s ease-in-out;
        transform: translateX(100%);
        background: var(--color-bg);
        z-index: 10000;
        box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, var(--opacity-backdrop));
    }
    input:checked + .cart {
        pointer-events: all;
        opacity: 1;
        transform: none;
    }
    .cart .btn {
        position: absolute;
        top: 0;
        right: 0;
    }
</style>
