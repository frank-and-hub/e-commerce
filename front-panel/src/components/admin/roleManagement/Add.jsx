import React, { useState } from 'react'
import { post } from '../../../utils/AxiosUtils'
import SelectPermission from '../form/select/SelectPermission'
import SubmitButton from '../form/SubmitButton'
import Input from '../form/Input'
import { notifyError, notifySuccess, notifyInfo } from '../comman/notification/Notification'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '../../../context/LoadingContext'
import CardForm from '../card/CardForm'
import { roleValidation, useFormValidation } from '../../../utils/FormValidation'

function Add() {

    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);
    const navigate = useNavigate();

    const initialState = {
        name: '',
        permissions: []
    };

    const { formData: values, errors, handleChange, handleSubmit: validateSubmit, setFormData: setValues } = useFormValidation(initialState, roleValidation);

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
            const res = await post('/roles', values);
            if (res) {
                resetForm()
                notifySuccess(res.message)
                navigate('/admin/roles', { replace: true })
            }
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
                <SelectPermission id="permissions" value={values.permissions} handleChange={handleChange} error={errors.permissions} required={true} disabled={false} label='Permissions' />
            </div>
            <div className={`col-12`}>
                <SubmitButton className={`custom`} disable={loading} name={loading ? 'Submitting...' : 'Submit Form'} />
            </div>
        </CardForm>
    );
}

export default Add;
