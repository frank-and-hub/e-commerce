export default function validate(values) {
    let errors = {}
    if (!values.name) errors.name = 'Please enter name';
    if (!values.description) errors.description = 'Please enter description';
    if (!values.url) errors.url = 'Please enter url';
    if (!values.type) errors.type = 'Please select type';
    if (!values.image) errors.image = 'Please select image';
    return errors;
}
