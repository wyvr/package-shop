<script>
    import Email from '@src/form/Email.svelte';
    import Password from '@src/form/Password.svelte';
    import Buttons from '@src/shop/customer/login/Buttons.svelte';
    import { url_join } from '@src/shop/core/url.js';
    import { forgot_password_link } from '@src/shop/config/forgot_password_link.js';
    import { onMount } from 'svelte';

    export let focus = false;
    export let store = null;
    export let open = false;
    export let id_prefix = '';

    let state = 'inactive';
    let email = _inject('config._secrets.shop.customer_email', '');
    let password = _inject('config._secrets.shop.customer_password', '');
    let form;
    $: action = url_join(store, 'api', 'customer', 'login');
    $: is_valid(email, password);

    function is_valid() {
        if (state != 'busy') {
            state = form?.checkValidity() ? 'idle' : 'inactive';
        }
    }

    onMount(() => {
        const stored_email = localStorage.getItem('customer.email');
        if (stored_email) {
            email = stored_email;
        }
        is_valid(email, password);
    });
</script>

<form bind:this={form} {action} method="POST">
    <div>
        <Email id={id_prefix + 'login_email'} required={true} {focus} disabled={state == 'busy'} bind:value={email}
            >{__('customer.email')}</Email
        >
    </div>
    <div>
        <Password id={id_prefix + 'login_password'} required={true} disabled={state == 'busy'} bind:value={password}
            >{__('customer.password')}</Password
        >
        <a href={forgot_password_link()}>{__('customer.forgot_password')}</a>
    </div>
    <Buttons bind:open bind:state {id_prefix} {form} />
</form>
