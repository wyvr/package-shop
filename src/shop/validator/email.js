export function sanitize_email(email) {
    if (typeof email !== 'string') {
        return '';
    }
    return email.trim().replace(/[^\w@.+\-_~]+/g, '');
}

export function is_valid_email(email) {
    if (typeof email !== 'string') {
        return false;
    }
    // email must contain a @ and a .
    if (
        email.indexOf('@') === -1 ||
        email.indexOf('.') === -1 ||
        email.indexOf('@') > email.lastIndexOf('.') ||
        email.indexOf('@') === 0 ||
        email.lastIndexOf('.') === email.length - 1 ||
        email.indexOf('@') !== email.lastIndexOf('@')
    ) {
        return false;
    }
    return sanitize_email(email) === email;
}
