<script>
    import Text from '@src/form/Text.svelte';
    import Email from '@src/form/Email.svelte';
    import Password from '@src/form/Password.svelte';
    import Checkbox from '@src/form/Checkbox.svelte';
    import InlineSpinner from '@src/shop/component/InlineSpinner.svelte';
    import { onMount } from 'svelte';

    export let focus = false;
    export let store = null;
    export let open;

    let state = 'idle';
    let form;
    $: action = `/${[store, 'api', 'customer', 'register'].filter(Boolean).join('/')}/`;

    onMount(() => {
        const stored_email = localStorage.getItem('customer.email');
        if (stored_email) {
            email = stored_email;
        }
    });
</script>

<form bind:this={form} {action} method="POST">
    <div>
        <Text id={'register_firstname'} required={true} {focus} disabled={state == 'busy'}
            >{__('customer.firstname')}</Text
        >
    </div>
    <div>
        <Text id={'register_lastname'} required={true} disabled={state == 'busy'}>{__('customer.lastname')}</Text>
    </div>
    <div>
        <Email id={'register_email'} required={true} disabled={state == 'busy'}>{__('customer.email')}</Email>
    </div>
    <div>
        <Password id={'register_password'} required={true} disabled={state == 'busy'}
            >{__('customer.password')}</Password
        >
    </div>
    <div>
        <Checkbox id={'register_newsletter'} disabled={state == 'busy'}>{__('customer.newsletter_register')}</Checkbox>
    </div>
    <div>
        {#if state == 'busy'}
            <button class="btn" type="button"><InlineSpinner /> {__('customer.create_account')}</button>
        {:else}
            <button class="btn" type="submit" on:click|preventDefault={(e) => send_register(e)}
                >{__('customer.create_account')}</button
            >
        {/if}
    </div>
</form>
