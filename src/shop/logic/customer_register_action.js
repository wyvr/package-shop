import { messages } from '@src/shop/stores/messages';
import { register_required_fields } from '@src/shop/config/register_required_fields';
import { build_formdata } from '@src/shop/api-client/build_formdata';
import { get_required_field_errors } from '@src/shop/api-client/get_required_field_errors';
import { customer_form_action } from '@src/shop/logic/customer_form_action';

export default async function (form, id_prefix = '', on_state_change = undefined) {
    if (typeof on_state_change != 'function') {
        on_state_change = () => {};
    }
    const errors = get_required_field_errors(register_required_fields, (id) => `input#${id_prefix}register_${id}`);
    if (errors.length > 0) {
        messages.push(errors, 'error');
        return;
    }
    if (!form) {
        messages.push(__('shop.internal_error'), 'error');
        return;
    }
    on_state_change({ state: 'busy' });

    // get form data
    const body = build_formdata(form, (id) => id.replace(new RegExp(`${id_prefix}register_`), ''));

    await customer_form_action(form, body, ({ error, message }) => {
        if (error) {
            messages.push(message, 'error');
            return;
        }
        messages.push(message, 'success', { permanent: true });
        on_state_change({ open: false });
    });

    on_state_change({ state: 'idle' });
}
