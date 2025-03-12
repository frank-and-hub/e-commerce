import React, { useState } from 'react'
import { useFormValidation } from '../../Form/FormValidation'
import { post } from '../../../../utils/AxiosUtils'
import validate from '../validate'
import SubmitButton from '../../Form/SubmitButton'
import Input from '../../Form/Input'
import { notifyError, notifySuccess, notifyInfo } from '../../Comman/Notification/Notification'
import SelectIcon from '../../Form/Select/SelectIcon'
import Textarea from '../../Form/Textarea'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '../../../../context/LoadingContext'
import CardForm from '../../Card/CardForm'

function Add() {
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);

    const initialState = {
        name: '',
        icon: '',
        description: ''
    };

    const { formData: values, errors, handleChange, handleSubmit: validateSubmit, setFormData: setValues } = useFormValidation(initialState, validate);

    const handleSubmit = async (e) => {
        e.preventDefault();
        notifyInfo(values);
        validateSubmit(e);
        if (errors && Object.keys(errors).length > 0) {
            // console.info(`Form validation failed : `);
            console.table(errors);
            return false;
        }
        setLoading(true)
        try {
            const res = await post('/categories', values);
            if (res) {
                resetForm()
                notifySuccess(res.message)
            }
            navigate('/admin/products/categories', { replace: true })
        } catch (err) {
            notifyError(err.message)
        } finally {
            setLoading(false)
        }
    };

    const resetForm = () => {
        setValues(initialState);
        setFormKey((prevKey) => prevKey + 1);
        document.getElementsByTagName('form')[0].reset();
    };

    return (
        <CardForm handleSubmit={handleSubmit} key={formKey}>
            <Input name={`name`} label="Name" value={values.name} onChange={handleChange} error={errors.name} required={true} inputType={true} />
            <div className={`col-md-4`}>
                <label htmlFor={`icon`} className={`form-label`}>Icon <span className='text-danger'>*</span></label>
                <SelectIcon id="icon" value={values.icon} handleChange={handleChange} error={errors.icon} />
                {errors.icon && <div className={`invalid-feedback`}>{errors.icon}</div>}
            </div>
            <Textarea name={`description`} className={`w-100`} label="Description" value={values?.description} onChange={handleChange} error={errors.description} required={true} inputType={true} ></Textarea>
            <div className={`col-12`}>
                <SubmitButton className={`custom`} name={loading ? 'Submitting...' : 'Submit Form'} />
            </div></CardForm>
    );
}

export default Add;
