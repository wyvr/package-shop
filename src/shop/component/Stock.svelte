<script>
    export let in_stock = false;
    export let qty = 0;

    $: is_in_stock = in_stock && qty > 0;
</script>

{#if is_in_stock}
    {#if qty < 5}
        <div class="in_stock red">
            <span class="text"> {__('product_stock.only_x_in_stock', { qty })}</span>
        </div>
    {:else if qty < 10}
        <div class="in_stock yellow">
            <span class="text in_stock"> {__('product_stock.only_x_in_stock', { qty })}</span>
        </div>
    {:else}
        <div class="in_stock green">
            <span class="text"> {__('product_stock.in_stock', { qty })}</span>
        </div>
    {/if}
{:else}
    <div class="out_of_stock">
        <span class="text">{__('product_stock.out_of_stock', { qty })} </span>
    </div>
{/if}

