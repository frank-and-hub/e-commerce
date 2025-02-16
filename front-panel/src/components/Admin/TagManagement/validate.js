export default function validate(values) {
    let errors = {}
    if (!values.name) errors.name = 'Please enter name';
    return errors;
}
