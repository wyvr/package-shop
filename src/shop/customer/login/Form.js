import { messages } from '@src/shop/stores/messages';
import { customer_login } from '@src/shop/logic/customer_login';

async function send_login() {
    const errors = [];
    for (const field of ['email', 'password']) {
        const input = document.querySelector(`input#login_${field}`);
        if (input?.required && !input.value) {
            errors.push(__('shop.missing_required_field', { name: __(`customer.${field}`) }));
            continue;
        }
        if (input?.type === 'email' && !input.value.match(/^\S+@\S+$/)) {
            errors.push(__('shop.invalid_field', { name: __(`customer.${field}`) }));
        }
    }

    if (errors.length > 0) {
        messages.push(errors, 'error');
        return;
    }
    if (!form) {
        messages.push(__('shop.internal_error'), 'error');
        return;
    }
    state = 'busy';

    formData = new FormData();
    // add fields
    for (const tag of form.querySelectorAll('input, textarea, select')) {
        const id = tag.id.replace(/^login_/, '');
        const type = tag.type.toLowerCase();
        if (['checkbox', 'radio'].indexOf(type) !== -1) {
            if (tag.checked) {
                formData.append(id, true);
            }
            continue;
        }
        formData.append(id, tag.value);
    }

    try {
        const response = await fetch(form.getAttribute('action'), {
            body: formData,
            method: form.getAttribute('method')
        });
        if (response) {
            const result = await response.json();
            if (response.ok && result) {
                customer_login(result);
                open = false;
            } else {
                messages.push(result.message, 'error');
            }
        }
    } catch (e) {
        console.error(e);
        messages.push(__('shop.internal_error'), 'error');
    }

    state = 'idle';
}
