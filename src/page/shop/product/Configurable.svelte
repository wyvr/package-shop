<script>
    import Configurable from '@src/shop/product/layout/Configurable.svelte';
    import ProductDetail from '@src/shop/product/layout/Detail.svelte';
    import ProductSwitcher from '@src/shop/product/Switcher.svelte';
    import Name from '@src/shop/product/Name.svelte';
    import ConfigurableOptions from '@src/shop/product/configurable/ConfigurableOptions.svelte';
    import { get_configurable_data } from '@src/shop/product/configurable/get_configurable_data.js';

    export let data = null;
    export let configurable;

    onServer(() => {
        if (data?.product?.type_id == 'configurable') {
            configurable = get_configurable_data(
                data?.product?.configurable_options,
                data?.product?.configurable_products
            );
        }
    });
</script>

<Configurable product={data.product} locale={data.locale} currency={data.currency} />
