export default function validate(values) {
    let errors = {}
    if (!values.first_name) errors.first_name = 'Please enter first name';
    if (!values.middle_name) errors.middle_name = 'Please enter middle name';
    if (!values.last_name) errors.last_name = 'Please enter last name';    
    if (!values.email) errors.email = 'Please enter email';
    if (!values.password) errors.password = 'Please enter password';
    if (!values.phone) errors.phone = 'Please enter phone';
    if (!values.role_id) errors.role_id = 'Please select role';
    return errors;
}
