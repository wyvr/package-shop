<script>
    import { wishlist } from '@src/shop/stores/wishlist';
    import Badge from '@src/shop/component/Badge.svelte';

    wyvr: {
        render: 'hydrate';
        loading: 'instant';
    }

    export let store;

    $: count = get_count($wishlist);
    $: url = `/${[store, 'wishlist'].filter(Boolean).join('/')}/`;

    function get_count(wishlist) {
        if (!wishlist || !wishlist.items) {
            return 0;
        }
        return Object.keys(wishlist.items).length;
    }
</script>

<section>
    <a title={__('wishlist.name')} href={url}>💙<Badge>{count}</Badge></a>
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
