<script>
    import Text from '@src/form/Text.svelte';
    import Email from '@src/form/Email.svelte';
    import Password from '@src/form/Password.svelte';
    import Checkbox from '@src/form/Checkbox.svelte';
    import { url_join } from '@src/shop/core/url.js';
    import Buttons from '@src/shop/customer/register/Buttons.svelte';
    import { onMount } from 'svelte';

    export let focus = false;
    export let store = null;
    export let open = false;
    export let id_prefix = '';

    let state = 'inactive';
    let form;
    let firstname;
    let lastname;
    let email;
    let password;
    $: action = url_join(store, 'api', 'customer', 'register');

    $: is_valid(firstname, lastname, email, password);

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
        is_valid(firstname, lastname, email, password);
    });
</script>

<form bind:this={form} {action} method="POST">
    <div>
        <Text
            id={id_prefix + 'register_firstname'}
            name="firstname"
            required={true}
            {focus}
            disabled={state == 'busy'}
            bind:value={firstname}>{__('customer.firstname')}</Text
        >
    </div>
    <div>
        <Text
            id={id_prefix + 'register_lastname'}
            name="lastname"
            required={true}
            disabled={state == 'busy'}
            bind:value={lastname}>{__('customer.lastname')}</Text
        >
    </div>
    <div>
        <Email
            id={id_prefix + 'register_email'}
            name="email"
            required={true}
            disabled={state == 'busy'}
            bind:value={email}>{__('customer.email')}</Email
        >
    </div>
    <div>
        <Password
            id={id_prefix + 'register_password'}
            name="password"
            required={true}
            disabled={state == 'busy'}
            bind:value={password}>{__('customer.password')}</Password
        >
    </div>
    <div>
        <Checkbox id={id_prefix + 'register_newsletter'} name="register_newsletter" disabled={state == 'busy'}
            >{__('customer.newsletter_register')}</Checkbox
        >
    </div>
    <Buttons bind:open bind:state {id_prefix} {form} />
</form>
