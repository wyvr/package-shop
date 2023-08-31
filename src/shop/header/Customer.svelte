<script>
    import is_logged_in from '@src/shop/stores/is_logged_in';
    import LoginDialog from '@src/shop/customer/login/Dialog.svelte';
    import { customer_logout } from '@src/shop/logic/customer_logout';
    import { url_join } from '@src/shop/core/url.mjs';

    wyvr: {
        render: 'hydrate';
        loading: 'interact';
    }

    export let store = null;

    $: url = url_join(store, 'account');

    let openLoginDialog = false;
</script>

<section>
    <a href={url}>{__('customer.my_account')}</a>
    <nav>
        {#if $is_logged_in && isClient}
            <a href={url}>{__('customer.my_account')}</a>
            <button type="button" on:click={() => customer_logout()}>{__('customer.logout')}</button>
        {:else}
            <a href={url}>{__('customer.register')}</a>
            <button type="button" on:click={() => (openLoginDialog = true)}>{__('customer.login')}</button>
        {/if}
    </nav>
</section>
{#if isClient}
    <LoginDialog bind:open={openLoginDialog} {store} />
{/if}

<style>
    section {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
    }
    section > a {
        color: var(--color-primary);
    }

    nav {
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--color-bg);
        z-index: 10000;
        padding: 1rem;
        white-space: nowrap;
        display: flex;
        flex-direction: column;
        align-items: end;
        pointer-events: none;
        opacity: 0;
        box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, var(--opacity-backdrop));
        transition: opacity 0.1s linear;
    }
    section:hover nav {
        pointer-events: all;
        opacity: 1;
    }
    nav a,
    nav button {
        color: var(--color-text);
        background-color: transparent;
        border: none;
        font-size: 1em;
        text-decoration: none;
        cursor: pointer;
    }
</style>
