import React, { useState } from 'react'
import { post } from '../../../utils/AxiosUtils'
import SubmitButton from '../form/SubmitButton'
import Input from '../form/Input'
import { notifyError, notifySuccess, notifyInfo } from '../comman/notification/Notification'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '../../../context/LoadingContext'
import CardForm from '../card/CardForm'
import { unitValidation, useFormValidation } from '../../../utils/FormValidation'

function Add() {

    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);
    const navigate = useNavigate();
    const initialState = {
        name: '',
        short_name: ''
    };

    const { formData: values, errors, handleChange, handleSubmit: validateSubmit, setFormData: setValues } = useFormValidation(initialState, unitValidation);

    const handleSubmit = async (e) => {
        e.preventDefault();
        notifyInfo(values);
        validateSubmit(e);
        if (errors && Object.keys(errors).length > 0) {
            console.table(errors);
            return false;
        }
        setLoading(true)
        try {
            const res = await post('/units', values);
            if (res) {
                resetForm()
                notifySuccess(res.message)
            }
            navigate('/admin/products/units', { replace: true })
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
            <Input name={`short_name`} label="Short Name" value={values.short_name} onChange={handleChange} error={errors.short_name} required={true} inputType={true} />
            <div className={`col-12`}>
                <SubmitButton className={`custom`} disable={loading} name={loading ? 'Submitting...' : 'Submit Form'} />
            </div>
        </CardForm>
    );
}

export default Add;
