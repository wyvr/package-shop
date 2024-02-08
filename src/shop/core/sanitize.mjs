export function strip_tags(text) {
    if (!text) {
        return '';
    }
    if (typeof text === 'string') {
        return text.replace(/<(?:style|script)>.*?<\/(?:style|script)>/g, '').replace(/(<([^>]+)>)/gi, '');
    }
    return text;
}
export function trim_text(html_content, length = undefined) {
    const text = strip_tags(html_content || '');
    if (length && text.length > length) {
        return `${text.substring(0, length)}...`;
    }
    return text;
}
