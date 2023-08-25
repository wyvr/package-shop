<script>
    import StaticFacet from '@src/shop/facet/StaticFacet.svelte';

    export let filter = {};
    export let products = [];
</script>

<div>
    <StaticFacet bind:filter {products} on:details />
</div>
