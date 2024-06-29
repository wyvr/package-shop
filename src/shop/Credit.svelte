<script>
    import { get_credit_url } from '@src/shop/core/credit.js';
</script>

<div class="credit">
    <a rel="noopener" target="_blank" href={get_credit_url()}>made with 💙</a>
    <a rel="noopener" target="_blank" href="https://wyvr.dev">by wyvr</a>
</div>

<style>
    .credit {
        text-align: right;
        font-size: 0.75em;
    }
    a {
        color: #6d8ddf;
    }
</style>
