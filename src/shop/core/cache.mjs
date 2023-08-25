import { get_config_cache_path } from '@wyvr/generator/src/utils/config_cache.js';
import { read_json, write_json } from '@wyvr/generator/src/utils/file.js';
import { filled_string } from '@wyvr/generator/src/utils/validate.js';
import { join } from 'path';

export function get_cache(key) {
    return read_json(get_cache_path(key));
}
export function set_cache(key, value) {
    if (!filled_string(key)) {
        return false;
    }
    return write_json(get_cache_path(key), value);
}

export function get_cache_path(text) {
    const cache_key = join(
        'shop',
        text
            .replace(/^\//, '')
            .replace(/\/$/, '')
            .replace(/\//g, '|')
            .replace(/[^\w|\/]/g, '-')
    );

    return get_config_cache_path(cache_key);
}
