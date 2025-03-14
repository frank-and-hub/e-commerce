import { useState } from 'react'

export const useFormValidation = (initialState, validate) => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData({
            ...formData,
            [name]: ((type === 'checkbox') ? checked : ((type === 'file') ? files[0] : value))
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        setErrors(validationErrors);
    }

    return {
        formData,
        errors,
        handleChange,
        handleSubmit,
        setFormData
    }
}
