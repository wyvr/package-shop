<script>
    import Newsletter from '@src/shop/newsletter/SimpleForm.svelte';

    export let store = null;
</script>

<footer>
    <Newsletter store={store?.key} />
</footer>
