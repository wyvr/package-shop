<script>
    /**
     * @NOTE The parent of this component must have the css property `position: relative;`
    */
</script>

<span class="badge"><slot /></span>

<style>
    .badge {
        font-size: 12px;
        color: var(--color-text-on-primary);
        background-color: var(--color-primary);
        position: absolute;
        top: -0.75em;
        right: -0.75em;
        border-radius: 0.75em;
        pointer-events: none;
        min-width: 1.5em;
        height: 1.5em;
        line-height: 1.5em;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 0.4em;
    }
</style>
