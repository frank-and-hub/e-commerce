export default function validate(values) {
    let errors = {}
    if (!values.name) errors.name = 'Please enter name';
    if (!values.title) errors.title = 'Please enter title';
    if (!values.description) errors.description = 'Please enter description';
    return errors;
}
