export default function validate(values) {
    let errors = {}
    if (!values.name) errors.name = 'Please enter name';
    if (!values.description) errors.description = 'Please enter description';
    if (!values.icon) errors.icon = 'Please select icon';
    return errors;
}
