<script>
    import { compare } from '@src/shop/stores/compare';
    import Badge from '@src/shop/component/Badge.svelte';

    wyvr: {
        render: 'hydrate';
        loading: 'instant';
    }

    export let store;

    $: count = get_count($compare);
    $: url = `/${[store, 'compare'].filter(Boolean).join('/')}/`;

    function get_count(compare) {
        if (!compare || !compare.items) {
            return 0;
        }
        return Object.keys(compare.items).length;
    }
</script>

<section>
    <a title={__('compare.name')} href={url}>📊<Badge>{count}</Badge></a>
</section>

<style>
    section {
        height: 100%;
        display: flex;
        align-items: center;
    }
    a {
        font-size: 20px;
        padding: 0.4rem;

        position: relative;
        text-decoration: none;
    }
</style>
