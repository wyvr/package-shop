<script>
    import Text from '@src/form/Text.svelte';

    export let store = null;

    let email = _inject('config._secrets.shop.customer_email', '');
    let form;
    $: action = `/${[store, 'api', 'newsletter', 'subscribe'].filter(Boolean).join('/')}/`;
</script>

<form bind:this={form} {action} method="POST">
    <Text id={'email'} bind:value={email} required={true} placeholder={__('newsletter.email_placeholder')}
        >{__('customer.email')}</Text
    >
    <button class="btn" type="submit">{__('newsletter.subscribe')}</button>
</form>

<style>
    @import '@src/shop/component/btn.css';
    form {
        display: flex;
        gap: 0.5rem;
        align-items: stretch;
    }
    form :global(.base) {
        margin-bottom: 0 !important;
    }
</style>
