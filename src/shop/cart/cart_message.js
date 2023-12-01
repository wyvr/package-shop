import { messages } from '@src/shop/stores/messages';

export function cart_message(type, message, data) {
    messages.push(__(message, data), type);
}
