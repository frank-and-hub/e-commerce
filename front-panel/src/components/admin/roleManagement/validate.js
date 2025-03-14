export default function validate(values) {
    let errors = {}
    if (!values.name) errors.name = 'Please enter role name';
    if (!values.permissions) errors.permissions = 'Please select permissions';
    return errors;
}
