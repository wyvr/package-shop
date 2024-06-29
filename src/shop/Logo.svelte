<script>
    import { Config } from '@wyvr/generator/src/utils/config.js';
    import { url_join } from '@src/shop/core/url.js';

    export let name = '';
    export let store = 'de';

    $: url = url_join(store);

    onServer(() => {
        if (!name) {
            name = Config.get('shop.name');
        }
    });
</script>

<a href={url}><img src="/assets/logo.svg" alt={name} width="150" height="50" /></a>
