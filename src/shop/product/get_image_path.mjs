export function get_image_path(path) {
    return path ? ['media', 'catalog', 'product', ...path.split('/').filter((x) => x)].join('/') : undefined;
}
