export default function validate(values) {
    let errors = {}
    if (!values.question) errors.question = 'Please enter question';
    if (!values.answer) errors.answer = 'Please enter answer';
    return errors;
}
