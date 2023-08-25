<script>
    import LoginForm from '@src/shop/customer/login/Form.svelte';
    import RegisterForm from '@src/shop/customer/register/Form.svelte';
    import is_logged_in from '@src/shop/stores/is_logged_in';
    import { customer } from '@src/shop/stores/customer';
    import App from '@src/shop/customer/account/App.svelte';
    import { onMount } from 'svelte';
    import { customer_check } from '@src/shop/logic/customer_check';
    import { customer_logout } from '@src/shop/logic/customer_logout';

    wyvr: {
        render: 'hydrate';
        loading: 'instant';
    }

    export let store = null;
    export let stores = null;

    $: state = $is_logged_in ? 'customer' : 'unknown';

    onMount(() => {
        const email = $customer?.email;
        const token = $customer?.token;
        // check if customer is valid
        if (state == 'customer' && email) {
            customer_check(store, email, token, (error, data) => {
                if (error) {
                    customer_logout();
                    return;
                }
            });
        }
    });
</script>

{#if state == 'unknown'}
    <div class="account">
        <section>
            <h2>{__('customer.login')}</h2>
            <LoginForm focus={true} {store} />
        </section>
        <section>
            <h2>{__('customer.register')}</h2>
            <RegisterForm {store} />
        </section>
    </div>
{:else if state == 'customer' && isClient}
    <App {store} {stores} />
{/if}

<style>
    .account {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
    }
    section {
    }
</style>
