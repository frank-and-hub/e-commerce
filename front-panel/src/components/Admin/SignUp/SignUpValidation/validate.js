export default function validate(values) {
    let errors = {}

    // Name validation
    if (!values.name) {
        errors.name = 'Please enter your name';
    }

    // Email validation
    if (!values.email) {
        errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!values.password) {
        errors.password = 'Password is required';
    } else if (values.password.length < 6) {
        errors.password = 'Password needs to be at least 6 characters';
    }

    // Phone validation
    if (!values.phone) {
        errors.phone = 'Phone Number is required';
    } else if (!/^\d{10,}$/.test(values.phone)) {
        errors.phone = 'Phone number must be at least 10 digits and numeric only';
    }

    // Terms and conditions validation
    if (!values.terms) {
        errors.terms = 'You must agree to the terms and conditions';
    }

    return errors;
}
