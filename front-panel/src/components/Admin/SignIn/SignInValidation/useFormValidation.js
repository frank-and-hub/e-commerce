import { useState } from 'react'

const useFormValidation = (initialState, validate) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate(values);
        setErrors(validationErrors);
        setIsSubmitting(true);
    }

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        isSubmitting
    }
}

export default useFormValidation;
