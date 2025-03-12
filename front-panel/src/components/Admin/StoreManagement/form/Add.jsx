import React, { useState } from 'react'
import { useFormValidation } from '../../Form/FormValidation'
import { post } from '../../../../utils/AxiosUtils'
import validate from '../validate'
import SubmitButton from '../../Form/SubmitButton'
import Input from '../../Form/Input'
import { notifyError, notifySuccess, notifyInfo } from '../../Comman/Notification/Notification'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '../../../../context/LoadingContext'
import Textarea from '../../Form/Textarea'
import CardForm from '../../Card/CardForm'

function Add() {

    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);
    const navigate = useNavigate();
    const initialState = {
        name: ``,
        phone: ``,
        email: ``,
        address: ``,
        city: ``,
        state: ``,
        zipcode: ``,
        country: ``,
        supplier: ``
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
            const res = await post('/stores', values);
            if (res) {
                resetForm()
                notifySuccess(res.message)
            }
            navigate('/storage/stores', { replace: true })
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
            <Input name={`name`} label="name" value={values.name} onChange={handleChange} error={errors.name} required={true} inputType={true} />
            <Input name={`phone`} label="phone" value={values.phone} onChange={handleChange} error={errors.phone} required={true} inputType={true} />
            <Input name={`email`} label="email" value={values.email} onChange={handleChange} error={errors.email} required={true} inputType={true} />
            <Input name={`country`} label="country" value={values.country} onChange={handleChange} error={errors.country} required={true} inputType={true} />
            <Input name={`state`} label="state" value={values.state} onChange={handleChange} error={errors.state} required={true} inputType={true} />
            <Input name={`city`} label="city" value={values.city} onChange={handleChange} error={errors.city} required={true} inputType={true} />
            <Input name={`zipcode`} label="zipcode" value={values.zipcode} onChange={handleChange} error={errors.zipcode} required={true} inputType={true} />
            <Textarea name={`address`} label="address" value={values?.address} onChange={handleChange} error={errors.address} required={true} inputType={true} ></Textarea>
            <div className={`col-12`}>
                <SubmitButton className={`custom`} name={loading ? 'Submitting...' : 'Submit Form'} />
            </div>
        </CardForm>

    );
}

export default Add;
