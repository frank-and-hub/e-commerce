export default function validate(values) {
    let errors = {}
    if (!values.name) errors.name = 'Please enter menu name';
    if (!values.route) errors.route = 'Please enter menu route';
    if (!values.icon) errors.icon = 'Please select menu icon';
    return errors;
}
