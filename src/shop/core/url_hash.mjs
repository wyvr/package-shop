export function get_hash() {
    if (!document?.location?.hash) {
        return {};
    }
    const hash = document.location.hash.replace(/^#/, '');
    const hash_object = {};
    hash.split('&').forEach((item) => {
        if (item.indexOf('=') == -1) {
            hash_object[item] = true;
            return;
        }
        const kv = item.split('=');
        const key = kv.shift();
        hash_object[key] = kv.join('=');
    });
    return hash_object;
}
export function set_hash(hash) {
    if (!history || !document.location) {
        return;
    }
    if (!hash) {
        history.pushState(undefined, undefined, document.location.pathname + document.location.search);
        return;
    }
    history.replaceState(undefined, undefined, '#' + hash);
}
export function update_hash(data) {
    if (!data || typeof data != 'object') {
        return;
    }
    const hash = get_hash();
    Object.keys(data).forEach((key) => {
        hash[key] = data[key];
    });
    const hash_result = Object.keys(hash)
        .map((key) => {
            if (hash[key] === undefined) {
                return undefined;
            }
            if (hash[key] === true) {
                return key;
            }
            return `${key}=${hash[key]}`;
        })
        .filter((x) => x)
        .join('&');
    set_hash(hash_result);
}
