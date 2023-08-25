<script>
    import { get_category_navigation } from '@src/shop/header/get_category_navigation';
    import Entry from '@src/shop/header/navigation/Entry.svelte';

    export let store;

    const nav = _inject('collection.all', [], (list) => list.filter((entry) => entry.visible));
    let list = [];

    onServer(async () => {
        const cat_nav = await get_category_navigation(store);

        list = [].concat(nav, cat_nav);
    });
</script>

<label for="navigation-toggle"><span>{__('navigation.toggle')}</span></label>
<input type="checkbox" id="navigation-toggle" />
<nav>
    {#each list as entry}
        <Entry {entry} level={1} />
    {/each}
</nav>

<style>
    input {
        position: fixed !important;
        /* height: 1px; */
        /* width: 1px; */
        /* overflow: hidden; */
        /* clip: rect(1px, 1px, 1px, 1px); */
        appearance: none !important;
        /* width: 100vw; */
        /* height: 100vh; */
        background: transparent;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        border: 0;
        padding: 0;
        margin: 0;
        pointer-events: none;
        cursor: pointer;
    }
    input:checked {
        background: rgba(0, 0, 0, var(--opacity-backdrop));
        pointer-events: all;
    }
    label {
        position: absolute;
        cursor: pointer;
        top: 1rem;
        right: 1rem;
        height: 2rem;
        width: 2.2rem;
    }
    label span,
    label:before,
    label:after {
        background-color: var(--color-text);
        height: 0.4em;
        width: 100%;
        position: absolute;
        left: 0;
        border-radius: 2px;
    }
    label span {
        overflow: hidden;
        top: 50%;
        transform: translateY(-50%);
    }
    label:before,
    label:after {
        content: '';
    }
    label:before {
        top: 0;
    }
    label:after {
        bottom: 0;
    }
    nav {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.1s linear;
        background: var(--color-bg);
        z-index: 10000;
        padding: 1rem;
        box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, var(--opacity-backdrop));
    }
    input:checked + nav {
        pointer-events: all;
        opacity: 1;
    }
    @media (min-width: 768px) {
        label {
            display: none;
        }
        input {
            width: 1px;
            height: 1px;
        }
        input:checked {
            background: transparent;
        }

        nav {
            position: relative;
            display: flex;
            justify-content: center;
            opacity: 1;
            box-shadow: none;
            background: none;
            padding: 0;
            pointer-events: all;
            z-index: 1;
        }
    }
</style>
