<script>
    export let message;

    function get_content(message) {
        if (Array.isArray(message)) {
            return message.join('<br>');
        }
        if (typeof message == 'string') {
            return message;
        }
        console.warn('unknown message', message);
    }

    $: content = get_content(message);
</script>

<div>{@html content}</div>
