export default function validate(values) {
    let errors = {}
    if (!values.name) errors.name = 'Please enter name';
    if (!values.description) errors.description = 'Please enter description';
    if (!values.specification) errors.specification = 'Please enter specification';
    if (!values.price) errors.price = 'Please enter price';
    if (!values.quantity) errors.quantity = 'Please enter quantity';
    if (!values.discount_id) errors.discount_id = 'Please select discount';
    if (!values.brand_id) errors.brand_id = 'Please select brand';
    if (!values.tags) errors.tags = 'Please select tags';
    if (!values.categories) errors.categories = 'Please select categories';
    if (!values.image) errors.image = 'Please select image';
    return errors;
}
