export default function validate(values) {
    let errors = {}
    if (!values.name) errors.name = 'Please enter name';
    if (!values.url) errors.url = 'Please enter url';
    if (!values.icon) errors.icon = 'Please select icon';
    return errors;
}
