import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { post } from '../../../../../utils/AxiosUtils'
import { useFormValidation } from '../../../Form/FormValidation'
import { useLoading } from '../../../../../context/LoadingContext'
import validate from '../validate'
import Input from '../../../Form/Input'
import SelectIcon from '../../../Form/Select/SelectIcon'
import SubmitButton from '../../../Form/SubmitButton'
import { notifyError, notifyInfo, notifySuccess } from '../../../Comman/Notification/Notification'

function Add() {
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);

    const initialState = {
        name: '',
        icon: '',
        url: '',
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
            const res = await post('/social-details', values);
            if (res) {
                resetForm()
                notifySuccess(res.message)
            }
            navigate('/admin/settings/social-details', { replace: true })
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
                            <SelectIcon id="icon" value={values.icon} handleChange={handleChange} error={errors.icon} required={true} disabled={false} label='Icon' />
                        </div>
                        <Input name={`url`} text={`url`} label="Url" value={values.url} onChange={handleChange} error={errors.url} required={true} inputType={true} />
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
