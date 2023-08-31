<script>
    import Email from '@src/form/Email.svelte';
    import Password from '@src/form/Password.svelte';
    import InlineSpinner from '@src/shop/component/InlineSpinner.svelte';
    import { url_join } from '@src/shop/core/url.mjs';
    import { onMount } from 'svelte';

    export let focus = false;
    export let store = null;
    export let open;

    let state = 'idle';
    let form;
    $: action = url_join(store, 'api', 'customer', 'login');
    $: forgot_password_link = url_join(store, 'account', 'forgot_password');

    onMount(() => {
        const stored_email = localStorage.getItem('customer.email');
        if (stored_email) {
            email = stored_email;
        }
    });
</script>

<form bind:this={form} {action} method="POST">
    <div>
        <Email id={'login_email'} required={true} {focus} disabled={state == 'busy'}>{__('customer.email')}</Email>
    </div>
    <div>
        <Password id={'login_password'} required={true} disabled={state == 'busy'}>{__('customer.password')}</Password>
        <a href={forgot_password_link}>{__('customer.forgot_password')}</a>
    </div>
    <div class="buttons">
        {#if state == 'busy'}
            <button class="btn" type="button" disabled><InlineSpinner /> {__('customer.login')}</button>
        {:else}
            <button class="btn" type="submit" on:click|preventDefault={(e) => send_login(e)}
                >{__('customer.login')}</button
            >
        {/if}
        {#if open}
            <button
                class="btn btn--ghost"
                on:click={() => {
                    open = false;
                }}>{__('shop.cancel')}</button
            >
        {/if}
    </div>
</form>
