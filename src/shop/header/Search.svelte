<script>
    import { url_join } from '@src/shop/api-client/url_join';

    export let store;

    $: link = url_join(store, 'search');
</script>

<section>
    <a href={link} title={__('search.search')}>🔍</a>
</section>

<style>
    section {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
    }
    a {
        font-size: 20px;
        padding: 0.4rem;
        color: var(--color-primary);
        cursor: pointer;
    }
</style>
