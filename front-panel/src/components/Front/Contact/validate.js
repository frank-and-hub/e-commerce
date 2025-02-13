export default function validate(values) {
    let errors = {}
    if (!values.name) errors.name = 'Please enter name';
    if (!values.email) errors.email = 'Please enter email';
    if (!values.message) errors.message = 'Please enter message';
    return errors;
}
