export async function customer_form_action(form, body, on_sent) {
    if (typeof on_sent !== 'function') {
        on_sent = () => {};
    }
    const data = {
        error: true,
        message: __('shop.internal_error'),
        status: 500,
        data: undefined
    };
    try {
        const response = await fetch(form.getAttribute('action'), {
            body,
            method: form.getAttribute('method')
        });
        if (response) {
            data.status = response.status;
            const result = await response.json();
            data.message = result?.message;
            data.data = result;
            if (response.ok) {
                data.error = false;
            }
        }
    } catch (e) {
        console.error(e);
    }
    on_sent(data);
}
