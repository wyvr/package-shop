<script>
    import action from '@src/shop/logic/customer_register_action.js';
    import InlineSpinner from '@src/shop/component/InlineSpinner.svelte';

    export let open = false;
    export let state = 'inactive';
    export let id_prefix = '';
    export let form;

    function send_register(e) {
        action(form, id_prefix, (data) => {
            if (data['state']) {
                state = data['state'];
            }
            if (typeof data['open'] == 'boolean') {
                open = data['open'];
            }
        });
    }
</script>

<div class="buttons">
    {#if state == 'idle'}
        <button class="btn register" type="submit" on:click|preventDefault={(e) => send_register(e)}
            >{__('customer.create_account')}</button
        >
    {:else}
        <button class="btn register" type="button" disabled
            >{#if state == 'busy'}<InlineSpinner /> {/if}{__('customer.create_account')}</button
        >
    {/if}
    {#if open}
        <button
            class="btn close"
            on:click={() => {
                open = false;
            }}>{__('shop.cancel')}</button
        >
    {/if}
</div>
