export default function validate(values) {
    let errors = {}
    if (!values.name) errors.name = 'Please enter name';
    if (!values.hex_code) errors.hex_code = 'Please select hex code';
    return errors;
}
