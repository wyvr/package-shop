import { is_array } from '@wyvr/generator/src/utils/validate.js';

export function get_form_body_value(value) {
    if (!value) {
        return undefined;
    }
    if (is_array(value)) {
        return value[0];
    }
    return value;
}
