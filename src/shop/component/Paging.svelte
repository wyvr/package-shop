<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let page = 1;
    export let max = 1;
    export let show_pages = false;
    export let frame = 3; // can be bool false to show all

    $: pre_frame = get_pre_frame(page, max, frame);
    $: limit_pre_frame = frame && pre_frame && pre_frame.length == frame && pre_frame[0] != 1;

    $: post_frame = get_post_frame(page, max, frame);
    $: limit_post_frame = frame && post_frame && post_frame.length == frame && post_frame[frame - 1] != max;

    $: active_prev = pre_frame.length > 0;
    $: active_next = post_frame.length > 0;

    $: is_visible = show_pages && (max > 1 || page != max);

    function get_pre_frame(page, max, frame) {
        const to_max = limit(page, max) - 1;
        if (frame === false) {
            return get_frame(1, to_max);
        }
        return get_frame(limit(page - frame, max), to_max);
    }
    function get_post_frame(page, max, frame) {
        if (frame === false) {
            return get_frame(page + 1, limit(max, max));
        }
        return get_frame(page + 1, limit(page + frame, max));
    }

    function get_frame(from, to) {
        if (from > to) {
            return [];
        }
        if (from == to) {
            return [from];
        }
        return Array.from(Array(to - from + 1).keys()).map((i) => from + i);
    }

    function limit(value, max) {
        if (isNaN(value)) {
            return 1;
        }
        if (value < 1) {
            return 1;
        }
        if (value > max) {
            return max;
        }
        return value;
    }

    function prev() {
        dispatch_change(page - 1);
    }
    function next() {
        dispatch_change(page + 1);
    }
    function change(p) {
        dispatch_change(p);
    }

    function dispatch_change(p) {
        const new_page = limit(p);
        dispatch('change', {
            page: new_page,
        });
    }
</script>

<section>
    <button class="control" on:click={prev} title={__('paging.prev')} disabled={!active_prev}
        >{@html __('paging.prev_symbol')}</button
    >
    {#if is_visible}
        <div class="pages">
            {#if limit_pre_frame}
                <span class="limit">{@html __('paging.limit')}</span>
            {/if}
            {#each pre_frame as entry}
                <button class="pre" on:click={() => change(entry)}>{entry}</button>
            {/each}
            <span class="current">{page}</span>
            {#each post_frame as entry}
                <button class="post" on:click={() => change(entry)}>{entry}</button>
            {/each}
            {#if limit_post_frame}
                <span class="limit">{@html __('paging.limit')}</span>
            {/if}
        </div>
    {/if}
    <button class="control" on:click={next} title={__('paging.next')} disabled={!active_next}
        >{@html __('paging.next_symbol')}</button
    >
</section>
