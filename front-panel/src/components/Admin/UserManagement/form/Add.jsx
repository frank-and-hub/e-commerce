import React, { useState } from 'react'
import Input from '../../Form/Input'
import validate from '../validate'
import SubmitButton from '../../Form/SubmitButton'
import SelectRole from '../../Form/Select/SelectRole'
import { post } from '../../../../utils/AxiosUtils'
import { useFormValidation } from '../../Form/FormValidation'
import { notifySuccess, notifyInfo } from '../../Comman/Notification/Notification'
import { useNavigate } from 'react-router-dom'
import SelectDesignation from '../../Form/Select/SelectDesignation'
import { useLoading } from '../../../../context/LoadingContext'

function Add() {
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [formKey, setFormKey] = useState(0);

    const initialState = {
        name: '',
        email: '',
        password: '',
        phone: '',
        role_id: '',
        designations: []
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
            const res = await post('/users', values);
            setResponse(res);
            resetForm()
            notifySuccess(res.message)
            navigate('/users', { replace: true })
        } catch (err) {
            console.error(err.message);
            setError(err.message);
        } finally {
            setLoading(false)
        }
    };

    const resetForm = () => {
        setValues(initialState);
        setFormKey((prevKey) => prevKey + 1);
        document.getElementsByTagName('form')[0].reset();
    };

    if (response && error) {
        console.log(response && error);
    }

    return (
        <><div key={formKey} className='card'>
            <div className='card-body'>
                <form encType={`multipart/form-data`} className="row mt-3 g-4 needs-validation" onSubmit={handleSubmit} noValidate>
                    <Input name="name" label="User Name" value={values.name} onChange={handleChange} error={errors.name} required={true} inputType={true} />
                    <Input name="email" label="Email" type="email" value={values.email} onChange={handleChange} error={errors.email} required={true} inputType={true} />
                    <Input name="password" label="Password" value={values.password} onChange={handleChange} error={errors.password} required={true} inputType={true} />
                    <Input name="phone" label="Phone" value={values.phone} onChange={handleChange} error={errors.phone} required={true} inputType={true} />
                    <div className="col-md-4">
                        <SelectRole id={`role_id`} label={`Role`} value={values.role_id} handleChange={handleChange} error={errors.role_id} required={true} />
                    </div>
                    <div className="col-md-4">
                        <SelectDesignation id={`designations`} label={`Designations`} value={values?.designations} handleChange={handleChange} error={errors.designations} required={false} />
                    </div>
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
