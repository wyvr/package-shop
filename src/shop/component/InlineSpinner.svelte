<script>
    export let size = '0.75rem';
    export let speed = '0.75s';
    export let color = 'var(--color-text)';
    export let stroke = '0.15rem';

    $: style = [
        size ? `--spinner-size: ${size};` : '',
        speed ? `--spinner-speed: ${speed};` : '',
        color ? `--spinner-color: ${color};` : '',
        stroke ? `--spinner-stroke: ${stroke};` : '',
    ].join('');
</script>

<span {style} />
