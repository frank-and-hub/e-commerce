import React, { useState } from 'react'
import { useFormValidation } from '../../Form/FormValidation'
import validate from '../validate'
import SubmitButton from '../../Form/SubmitButton'
import Input from '../../Form/Input'
import { notifyError, notifySuccess, notifyInfo } from '../../Comman/Notification/Notification'
import Textarea from '../../Form/Textarea'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '../../../../context/LoadingContext'
import { checkFileValidation } from '../../../../utils/helper'
import config from '../../../../config'
import api from '../../../../utils/api'

function Add() {
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);
    const [src, setSrc] = useState('');
    const baseUrl = config.reactApiUrl;

    const initialState = {
        name: '',
        title: '',
        description: '',
        image: '',
        url: ''
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
            const res = await api({
                method: 'post',
                url: `${baseUrl}/banners`,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }, data: values
            });
            if (res) {
                resetForm()
                notifySuccess(res.message)
            }
            navigate('/admin/banners', { replace: true })
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

    const handleClick = (e) => {
        document.getElementById('imageInput').click();
    };

    const handleFileUpload = async (e) => {
        const formData = checkFileValidation(e) ? e.target.files[0] : null;
        const imageUrl = URL.createObjectURL(formData);
        setSrc(imageUrl);
        values.image = formData;
    };

    return (
        <>
            <div className={`card`}>
                <div className={`card-body`}>
                    <form key={formKey} encType={`multipart/form-data`} className={`row mt-3 g-3 needs-validation`} onSubmit={handleSubmit} noValidate>
                        <input type={`file`} id={`imageInput`} className={`d-none`} name={`image`} onChange={handleFileUpload} />
                        <Input name={`name`} label="Name" value={values.name} onChange={handleChange} error={errors.name} required={true} inputType={true} />
                        <Input name={`title`} label="title" value={values?.title} required={true} error={errors.title} inputType={true} disabled={false} onChange={handleChange} />
                        <Input name={`url`} label="url" value={values?.url} required={false} error={errors.url} inputType={true} disabled={false} onChange={handleChange} />
                        <Textarea onChange={handleChange} className={`w-100`} name={`description`} value={values?.description} error={errors.description} label={`Description`} required={true} disabled={false} />
                        <div className={`col-md-4`}>
                            <div className='cursor-none'>
                                <img src={src} alt={`Brand`} className={`rounded-25 col-md-6`} onClick={handleClick} style={{ cursor: 'pointer' }} />
                            </div>
                        </div>
                        <div className={`col-12`}>
                            <SubmitButton className={`custom`} name={loading ? 'Submitting...' : 'Submit Form'} />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Add;
