<script>
    import Email from '@src/form/Email.svelte';
    import Password from '@src/form/Password.svelte';
    import InlineSpinner from '@src/shop/component/InlineSpinner.svelte';
    import { onMount } from 'svelte';

    export let focus = false;
    export let store = null;
    export let open;

    let state = 'idle';
    let form;
    $: action = `/${[store, 'api', 'customer', 'login'].filter(Boolean).join('/')}/`;

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
    </div>
    <div>
        {#if state == 'busy'}
            <button class="btn" type="button"><InlineSpinner /> {__('customer.login')}</button>
        {:else}
            <button class="btn" type="submit" on:click|preventDefault={(e) => send_login(e)}
                >{__('customer.login')}</button
            >
        {/if}
    </div>
</form>
