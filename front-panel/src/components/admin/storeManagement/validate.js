export default function validate(values) {
    let errors = {}
    if (!values.name) errors.name = 'Please enter name';
    if (!values.percentage) errors.percentage = 'Please enter percentage';
    if (!values.description) errors.description = 'Please enter description';
    return errors;
}
