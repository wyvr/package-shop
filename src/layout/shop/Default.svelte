<script>
    import Credit from '@src/shop/Credit.svelte';
    import Header from '@src/shop/Header.svelte';
    import Footer from '@src/shop/Footer.svelte';
    import Error from '@src/shop/Error.svelte';
    import Messages from '@src/shop/Messages.svelte';
    import Breadcrumbs from '@src/shop/Breadcrumbs.svelte';

    export let data = null;
</script>

<noscript>
    <Error text={__('shop.javascript_required')} />
</noscript>
<Header store={data.store} stores={data.stores} locale={data.locale} currency={data.currency} />
<Messages />
<main>
    <Breadcrumbs />
    <slot />

    <Credit />
</main>
<Footer store={data.store} stores={data.stores} />

<!-- <pre>{JSON.stringify(data, null, 4)}</pre> -->
<style>
    main {
        margin: 0 auto;
        max-width: 1580px;
        padding-right: 1rem;
        padding-left: 1rem;
    }
</style>
