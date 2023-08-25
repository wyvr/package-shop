<script>
    import { onMount } from 'svelte';
    import Results from '@src/shop/search/instant/Results.svelte';
    import InlineSpinner from '@src/shop/component/InlineSpinner.svelte';

    wyvr: {
        render: 'hydrate';
        loading: 'interact';
    }

    export let id = 'instantsearch';
    export let store = 'en';
    export let action;

    let form;
    let timer;
    let state = 'idle';
    let data;
    let open = false;
    let value;

    $: action_value = action || `/${store}/search`;
    $: fetch_url = `/${store}/search/instant/`;

    onMount(() => {
        form.addEventListener('submit', execute_search);
        form.querySelector('input[type=text]').addEventListener('keyup', execute_search);
    });

    async function search() {
        if (state == 'busy') {
            return undefined;
        }
        if (!form) {
            return undefined;
        }
        const body = new FormData(form);
        try {
            state = 'busy';
            const response = await fetch(fetch_url, { method: 'POST', body });
            state = 'idle';
            return await response.json();
        } catch (e) {
            console.error(e);
        }
        state = 'idle';
        return undefined;
    }

    function execute_search(e) {
        e.preventDefault();
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(async () => {
            const result = await search();
            if (result) {
                data = result;
            }
        }, 250);
    }

    function focus() {
        open = true;
    }

    function force_search() {
        form.removeEventListener('submit', execute_search);
        form.submit();
    }
</script>

<form action={action_value} method="get" bind:this={form}>
    <div role="search" class:open>
        {#if state == 'busy'}
            <InlineSpinner />
        {/if}
        <label for={id}>{__('search.quicksearch')}</label>
        <input {id} type="text" placeholder={__('search.quicksearch')} name="q" bind:value on:focus={focus} />
        <button class="btn">{__('search.search')}</button>
    </div>
</form>

<Results {data} bind:open on:force_search={force_search} />
