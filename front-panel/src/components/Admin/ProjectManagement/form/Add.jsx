import React, { useEffect, useState } from 'react'
import config from '../../../../config'
import api from '../../../../utils/api'

import validate from '../validate'
import Input from '../../Form/Input'
import Textarea from '../../Form/Textarea'
import SubmitButton from '../../Form/SubmitButton'
import SelectForm from '../../Form/Select/SelectForm'

import { useNavigate } from 'react-router-dom'
import { useFormValidation } from '../../Form/FormValidation'
import { useLoading } from '../../../../context/LoadingContext'
import { OptionsProjectType } from '../../../../utils/selects'
import { notifyError, notifySuccess, notifyInfo } from '../../Comman/Notification/Notification'
import { checkFileValidation } from '../../../../utils/helper'

function Add() {

    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);
    const [src, setSrc] = useState('');
    const navigate = useNavigate();

    const baseUrl = config.reactApiUrl;

    const initialState = {
        name: '',
        description: '',
        url: '',
        type: '',
        image: ''
    };

    const { formData: values, errors, handleChange, handleSubmit: validateSubmit, setFormData: setValues } = useFormValidation(initialState, validate);

    const handleSubmit = async (e) => {
        e.preventDefault();
        validateSubmit(e);
        notifyInfo(values);
        if (errors && Object.keys(errors).length > 0) {
            console.info(`Form validation failed : `);
            console.table(errors);
            return false;
        }
        setLoading(true)
        try {
            const res = await api({
                method: 'post',
                url: `${baseUrl}/projects`,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }, data: values
            });

            // const res = await post('/projects', values);
            if (res) {
                setSrc(res?.response?.data?.image);
                resetForm()
                notifySuccess(res.message)
            }
            navigate('/projects', { replace: true })
        } catch (err) {
            notifyError(err.message)
        } finally {
            setLoading(false)
        }
    };

    const handleClick = (e) => {
        document.getElementById('imageInput').click();
    };

    const resetForm = () => {
        setValues(initialState);
        setFormKey((prevKey) => prevKey + 1);
        document.getElementsByTagName('form')[0].reset();
    };

    const handleFileUpload = async (e) => {
        const formData = checkFileValidation(e) ? e.target.files[0] : null;
        const imageUrl = URL.createObjectURL(formData);
        setSrc(imageUrl);
        values.image = formData;
    };

    useEffect(() => {
        setSrc(`/admin-assets/img/profile-img.jpg`);
    }, [src]);

    return (
        <>
            <div className='card'>
                <div className='card-body'>
                    <form key={formKey} encType={`multipart/form-data`} className="row mt-3 g-3 needs-validation" onSubmit={handleSubmit} noValidate>
                        <Input name="name" label="Name" value={values?.name} onChange={handleChange} error={errors.name} required={true} inputType={true} />
                        <Input name={`url`} text={`url`} label="Url" value={values?.url} onChange={handleChange} error={errors.url} required={true} inputType={true} />
                        <div className="col-md-4">
                            <SelectForm id="type" value={values?.type} handleChange={handleChange} error={errors.type} required={true} disabled={false} label='Type' Options={OptionsProjectType} />
                        </div>
                        <Textarea name="description" className={`w-100`} label="Description" value={values?.description} onChange={handleChange} error={errors.description} required={true} inputType={true} ></Textarea>
                        {/* <Input name="image" label="Image" type={`file`} value={values?.image} onChange={(e) => setValues({ ...values, image: e.target.files[0] })} error={errors.image} required={true} inputType={true} /> */}
                        <input type={`file`} id={`imageInput`} className={`d-none`} name={`image`} onChange={handleFileUpload} />
                        <div className='col-md-6'>
                            <div className='cursor-none'>
                                <img src={src} alt={`Project main`} className={`rounded-25 col-md-6`} onClick={handleClick} style={{ cursor: 'pointer' }} />
                            </div>
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
