export default function validate(values) {
    let errors = {}
    if (!values.user_id) errors.user_id = 'Please select user';
    // if (!values.role_id) errors.role_id = 'Please select role';
    return errors;
}
