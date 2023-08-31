export function build_formdata(form, transform_field_id) {
    if (typeof transform_field_id != 'function') {
        transform_field_id = (id) => id;
    }
    const form_data = new FormData();
    // add fields
    Array.from(form.querySelectorAll('input, textarea, select')).forEach((tag) => {
        const id = transform_field_id(tag.id);
        const type = tag.type.toLowerCase();
        if (['checkbox', 'radio'].indexOf(type) != -1) {
            if (tag.checked) {
                form_data.append(id, true);
            }
            return;
        }
        form_data.append(id, tag.value);
    });
    return form_data;
}
