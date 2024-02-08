export async function customer_check(store, email, token, onFinished = () => {}) {
    if (!email || !token) {
        onFinished({ message: 'No customer data available' }, undefined);
        return;
    }
    const url = `/${[store, 'api', 'customer', 'valid'].filter(Boolean).join('/')}/${email.trim()}/`;
    let successfull;
    let result;
    let response;
    try {
        response = await fetch(url, {
            headers: {
                authorization: `Bearer ${token}`
            },
            method: 'get'
        });
        successfull = response.ok;
    } catch (e) {
        console.error(e);
        onFinished(e, undefined);
        return;
    }

    try {
        result = await response.json();
    } catch (e) {
        console.error(e);
        onFinished(e, undefined);
        return;
    }

    if (!successfull) {
        onFinished(result, undefined);
    }

    onFinished(undefined, result);
}
