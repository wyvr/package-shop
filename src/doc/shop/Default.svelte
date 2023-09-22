<script>
    import Seo from '@src/shop/head/Seo.svelte';
    import HeadIncludes from '@src/shop/head/Includes.svelte';
    import BodyIncludes from '@src/shop/body/Includes.svelte';

    export let data = null;
</script>

<!DOCTYPE html>
<html lang={data?._wyvr?.language || 'en'} data-store-key={data?.store?.key}>
    <head>
        <Seo {data} />
        <HeadIncludes {data} />
    </head>
    <body>
        <slot />

        <BodyIncludes {data} />
    </body>
</html>
