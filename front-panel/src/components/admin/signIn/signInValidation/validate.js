export default function validate(values) {
    let errors = {}

    if (!values.email) {
        errors.email = 'Enter your Email';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!values.password) {
        errors.password = 'Please enter your password';
    } else if (values.password.length < 6) {
        errors.password = 'Password needs to be at least 6 characters';
    }

    return errors;
}