import React, { useState } from 'react'
import { useFormValidation } from '../../Form/FormValidation'
import { post } from '../../../../utils/AxiosUtils'
import validate from '../validate'
import SelectPermission from '../../Form/Select/SelectPermission'
import SubmitButton from '../../Form/SubmitButton'
import Input from '../../Form/Input'
import { notifyError, notifySuccess, notifyInfo } from '../../Comman/Notification/Notification'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '../../../../context/LoadingContext'

function Add() {

    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);
    const navigate = useNavigate();

    const initialState = {
        name: '',
        permissions: []
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
            const res = await post('/roles', values);
            if (res) {
                resetForm()
                notifySuccess(res.message)
                navigate('/roles', { replace: true })
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
        <>
            <div className='card'>
                <div className='card-body'>
                    <form key={formKey} encType={`multipart/form-data`} className="row mt-3 g-3 needs-validation" onSubmit={handleSubmit} noValidate>
                        <Input name="name" label="Name" value={values.name} onChange={handleChange} error={errors.name} required={true} inputType={true} />
                        <div className="col-md-4">
                            <SelectPermission id="permissions" value={values.permissions} handleChange={handleChange} error={errors.permissions} required={true} disabled={false} label='Permissions' />
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
