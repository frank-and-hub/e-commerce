import React, { useState } from 'react'
import { useFormValidation } from '../../Form/FormValidation'
import { post } from '../../../../utils/AxiosUtils'
import validate from '../validate'
import SubmitButton from '../../Form/SubmitButton'
import Input from '../../Form/Input'
import { notifyError, notifySuccess, notifyInfo } from '../../Comman/Notification/Notification'
import { useNavigate } from 'react-router-dom'
import Textarea from '../../Form/Textarea'
import { useLoading } from '../../../../context/LoadingContext'

function Add() {

    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);
    const navigate = useNavigate();
    const initialState = {
        name: '',
        title: '',
        description: '',
    };

    const { formData: values, errors, handleChange, handleSubmit: validateSubmit, setFormData: setValues } = useFormValidation(initialState, validate);

    const handleSubmit = async (e) => {
        e.preventDefault();
        notifyInfo(values);
        validateSubmit(e);
        if (errors && Object.keys(errors).length > 0) {
            console.info(`Form validation failed : `);
            console.table(errors);
            return false;
        }
        setLoading(true)
        try {
            const res = await post('/testimonials', values);
            if (res) {
                resetForm()
                notifySuccess(res.message)
            }
            navigate('/testimonials', { replace: true })
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
        <>
            <div className='card'>
                <div className='card-body'>
                    <form key={formKey} encType={`multipart/form-data`} className="row mt-3 g-3 needs-validation" onSubmit={handleSubmit} noValidate>
                        <Input name="name" label="Name" value={values.name} onChange={handleChange} error={errors.name} required={true} inputType={true} />
                        <Input name="title" label="Title" value={values.title} onChange={handleChange} error={errors.title} required={true} inputType={true} />
                        <Textarea onChange={handleChange} name={`description`} value={values?.description} error={errors.description} label={`Description`} required={true} disabled={false} />
                        <div className="col-12">
                            <SubmitButton className={`custom`} name={loading ? 'Submitting...' : 'Submit Form'} />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Add;
