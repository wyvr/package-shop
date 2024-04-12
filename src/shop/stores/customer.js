import { writable } from 'svelte/store';
import { isServer } from '@wyvr/generator';
import { load, save } from '@src/wyvr/stores/storage.js';
import { getSharedStore, setSharedStore } from '@src/wyvr/stores/shared.js';

export const customer_storage_name = 'customer_data';

function createCustomer() {
    // customer is always null on server, no customer available
    if (isServer) {
        return null;
    }
    const store = getSharedStore(customer_storage_name);
    if (store) {
        return store;
    }
    const current_customer = load(customer_storage_name, null);
    // load customer from storage
    const customer_store = writable(current_customer);

    // notification from other tab
    window.addEventListener('storage', (e) => {
        if (e.key === customer_storage_name) {
            try {
                const value = JSON.parse(e.newValue);
                customer_store.set(value);
            } catch (_) {
                customer_store.set(null);
            }
        }
    });
    // set current value of the store
    customer_store.subscribe((customer) => {
        save(customer_storage_name, customer);
    });
    return setSharedStore(customer_storage_name, customer_store);
}

export const customer = createCustomer();
