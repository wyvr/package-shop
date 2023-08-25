import { token } from '@src/shop/stores/token';
import { customer } from '@src/shop/stores/customer';
import { messages } from '@src/shop/stores/messages';
import { customer_login } from '@src/shop/logic/customer_login';

async function send_login() {
    const errors = [];
    ['email', 'password'].forEach((field) => {
        const input = document.querySelector(`input#login_${field}`);
        if (input && input.required && !input.value) {
            errors.push(__('shop.missing_required_field', { name: __(`customer.${field}`) }));
            return;
        }
        if (input.type == 'email' && !input.value.match(/^\S+@\S+$/)) {
            errors.push(__('shop.invalid_field', { name: __(`customer.${field}`) }));
            return;
        }
    });

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
    Array.from(form.querySelectorAll('input, textarea, select')).forEach((tag) => {
        const id = tag.id.replace(/^login_/, '');
        const type = tag.type.toLowerCase();
        if (['checkbox', 'radio'].indexOf(type) != -1) {
            if (tag.checked) {
                formData.append(id, true);
            }
            return;
        }
        formData.append(id, tag.value);
    });

    try {
        const response = await fetch(form.getAttribute('action'), {
            body: formData,
            method: form.getAttribute('method'),
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
