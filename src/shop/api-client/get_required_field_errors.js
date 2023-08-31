export function get_required_field_errors(fields, transform_field_id_to_selector, get_field_id_translation) {
    if (typeof transform_field_id_to_selector != 'function') {
        transform_field_id_to_selector = (id) => id;
    }
    if (typeof get_field_id_translation != 'function') {
        get_field_id_translation = (id) => `customer.${id}`;
    }
    if (!Array.isArray(fields)) {
        return [];
    }
    return fields
        .map((field_id) => {
            const input = document.querySelector(transform_field_id_to_selector(field_id));
            const translation = get_field_id_translation(field_id);
            if (!input || (input.required && !input.value)) {
                return __('shop.missing_required_field', { name: __(translation) });
            }
            if (input.type == 'email' && !input.value.match(/^\S+@\S+$/)) {
                return __('shop.invalid_field', { name: __(translation) });
            }
            return undefined;
        })
        .filter(Boolean);
}
