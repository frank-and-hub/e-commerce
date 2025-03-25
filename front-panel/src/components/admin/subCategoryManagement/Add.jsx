import React, { useState } from 'react'
import { post } from '../../../utils/AxiosUtils'
import SubmitButton from '../form/SubmitButton'
import Input from '../form/Input'
import { notifyError, notifySuccess, notifyInfo } from '../comman/notification/Notification'
import SelectIcon from '../form/select/SelectIcon'
import Textarea from '../form/Textarea'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '../../../context/LoadingContext'
import SelectCategory from '../form/select/SelectCategory'
import CardForm from '../card/CardForm'
import { subCategoryValidation, useFormValidation } from '../../../utils/FormValidation'

function Add() {
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);

    const initialState = {
        name: '',
        icon: '',
        category: '',
        description: ''
    };

    const { formData: values, errors, handleChange, handleSubmit: validateSubmit, setFormData: setValues } = useFormValidation(initialState, subCategoryValidation);

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
            const res = await post('/sub-categories', values);
            if (res) {
                resetForm()
                notifySuccess(res.message)
            }
            navigate('/admin/products/sub-categories', { replace: true })
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
                <SelectIcon id="icon" label={`icon`} value={values.icon} handleChange={handleChange} error={errors.icon}  required={true} />
            </div>
            <div className={`col-md-4`}>
                <SelectCategory id={`category`} label={`category`} value={values.category} handleChange={handleChange} error={errors.category} required={true} multiple={false} />
            </div>
            <Textarea name={`description`} className={`w-100`} label="Description" value={values?.description} onChange={handleChange} error={errors.description} required={true} inputType={true} ></Textarea>
            <div className={`col-12`}>
                <SubmitButton className={`custom`} disable={loading} name={loading ? 'Submitting...' : 'Submit Form'} />
            </div>
        </CardForm>
    );
}

export default Add;
