export function load(key, fallback) {
    if (!key || !localStorage) {
        return fallback;
    }
    const value = localStorage.getItem(key);
    if (value) {
        // console.log('storage load', key, value, typeof value)
        try {
            return JSON.parse(value);
        } catch (e) {
            console.warn('storage load error', key, e);
        }
    }
    // console.log('storage load fallback', key, fallback)
    return fallback;
}
export function save(key, value) {
    if (!key || !localStorage) {
        return false;
    }
    // console.log('storage save', key, value, typeof value)

    if(value == null) {
        localStorage.removeItem(key);
        return true;
    }
    localStorage.setItem(key, JSON.stringify(value));
    return true;
}
export function watch(key) {}
