export function get_image_path(path) {
    if (!path || typeof path !== 'string') {
        return undefined;
    }
    if (path.match(/^https?:\/\//)) {
        return path;
    }
    return ['media', 'catalog', 'product', ...path.split('/').filter((x) => x)].join('/');
}
