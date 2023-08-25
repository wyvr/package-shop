<script>
    export let action;
    export let term = '';
</script>

<form {action} method="get">
    <div role="search">
        <label for="q">{__('search.quicksearch')}</label>
        <input id="q" type="text" placeholder={__('search.quicksearch')} name="q" bind:value={term} />
        <input class="button" type="button" value={__('search.search')} />
    </div>
</form>
