export function get_id(value) {
    if (!value || !new Set(['string', 'number']).has(typeof value)) {
        return new Date().getTime() + '';
    }
    return value.toString().toLowerCase().replace(/\W+/g, '-');
}
