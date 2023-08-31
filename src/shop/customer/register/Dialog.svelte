<script>
    import Dialog from '@src/shop/component/Dialog.svelte';
    import Form from '@src/shop/customer/register/Form.svelte';

    export let open = false;
    export let store = null;
</script>

<Dialog id={'login-dialog'} bind:open title={__('customer.register')}>
    <slot slot="close" name="close" />
    <div class="content">
        <Form focus={open} {store} bind:open id_prefix={'dialog_'} />
    </div>
</Dialog>

<style>
    .content {
        padding: 1rem;
        width: min(80vw, 300px);
    }
</style>
