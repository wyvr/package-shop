<script>
    import Dialog from '@src/shop/component/Dialog.svelte';
    import Form from '@src/shop/customer/login/Form.svelte';

    export let open = false;
    export let store = null;
</script>

<Dialog id={'register-dialog'} bind:open title={__('customer.login')}>
    <slot slot="close" name="close" />
    <div class="content">
        <Form focus={open} {store} bind:open />
    </div>
</Dialog>

<style>
    .content {
        padding: 1rem;
        width: min(80vw, 300px);
    }
</style>
