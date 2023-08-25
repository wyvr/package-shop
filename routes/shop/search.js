export default {
    url: '/[store]/search',
    _wyvr: {
        template: [`shop/Search`, 'shop/Default'],
        methods: ['get', 'post'],
        persist: false,
        language: 'en',
    },
    title: () => __('search.search'),
    content: 'missing search implementation',
};
