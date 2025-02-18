import React, { useEffect, useState } from 'react'
import config from '../../../../config'
import api from '../../../../utils/api'

import validate from '../validate'
import Input from '../../Form/Input'
import Textarea from '../../Form/Textarea'
import SubmitButton from '../../Form/SubmitButton'

import { useNavigate } from 'react-router-dom'
import { useFormValidation } from '../../Form/FormValidation'
import { useLoading } from '../../../../context/LoadingContext'
import { notifyError, notifySuccess, notifyInfo } from '../../Comman/Notification/Notification'
import { checkFileValidation } from '../../../../utils/helper'
import SelectTag from '../../Form/Select/SelectTag'
import SelectCategory from '../../Form/Select/SelectCategory'
import SelectColor from '../../Form/Select/SelectColor'
import SelectDiscount from '../../Form/Select/SelectDiscount'
import SelectBrand from '../../Form/Select/SelectBrand'

function Add() {

    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);
    const [src, setSrc] = useState('');
    const navigate = useNavigate();


    const baseUrl = config.reactApiUrl;

    const initialState = {
        name: '',
        description: ``,
        specification: ``,
        price: ``,
        quantity: ``,
        discount_id: ``,
        brand_id: ``,
        tags: [],
        categories: [],
        image: ``,
    };

    const { formData: values, errors, handleChange, handleSubmit: validateSubmit, setFormData: setValues } = useFormValidation(initialState, validate);

    const handleSubmit = async (e) => {
        e.preventDefault();
        validateSubmit(e);
        notifyInfo(values);
        if (errors && Object.keys(errors).length > 0) {
            // console.info(`Form validation failed : `);
            console.table(errors);
            return false;
        }
        setLoading(true)
        try {
            const res = await api({
                method: 'post',
                url: `${baseUrl}/products`,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }, data: values
            });

            // const res = await post('/products', values);
            if (res) {
                setSrc(res?.response?.data?.image);
                resetForm()
                notifySuccess(res.message)
            }
            navigate('/admin/products', { replace: true })
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
        setSrc(src !== '' ? src : `/admin/img/profile-img.jpg`);
    }, [src]);

    return (
        <>
            <div className='card'>
                <div className='card-body'>
                    <form key={formKey} encType={`multipart/form-data`} className="row mt-3 g-3 needs-validation" onSubmit={handleSubmit} noValidate>
                        <Input name="name" label="Name" value={values?.name} onChange={handleChange} error={errors.name} required={true} inputType={true} />
                        <Input name={`price`} text={`price`} label="price" value={values?.price} onChange={handleChange} error={errors.price} required={true} inputType={true} />
                        <Input name={`quantity`} text={`quantity`} label="quantity" value={values?.quantity} onChange={handleChange} error={errors.quantity} required={true} inputType={true} />
                        <div className="col-md-4">
                            <SelectBrand id={`brand_id`} label={`brand`} value={values.brand_id} handleChange={handleChange} error={errors.brand_id} required={true} />
                        </div>
                        <div className="col-md-4">
                            <SelectCategory id={`categories`} label={`categories`} value={values.categories} handleChange={handleChange} error={errors.categories} required={true} multiple={true} />
                        </div>
                        <div className="col-md-4">
                            <SelectTag id={`tags`} label={`tags`} value={values.tags} handleChange={handleChange} error={errors.tags} required={true} multiple={true} />
                        </div>
                        <div className="col-md-4">
                            <SelectColor id={`colors`} label={`color`} value={values.colors} handleChange={handleChange} error={errors.colors} required={true} multiple={true} />
                        </div>
                        <div className="col-md-4">
                            <SelectDiscount id={`discount_id`} label={`discount`} value={values.discount_id} handleChange={handleChange} error={errors.discount_id} required={true} />
                        </div>
                        <Textarea name="description" className={`w-100`} label="description" value={values?.description} onChange={handleChange} error={errors.description} required={true} inputType={true} ></Textarea>
                        <Textarea name="specification" className={`w-100`} label="specification" value={values?.specification} onChange={handleChange} error={errors.specification} required={true} inputType={true} ></Textarea>
                        <input type={`file`} id={`imageInput`} className={`d-none`} name={`image`} onChange={handleFileUpload} />
                        <div className='col-md-4'>
                            <div className='cursor-none'>
                                <img src={src} alt={`Project main`} className={`rounded-25 col-md-6 w-50`} onClick={handleClick} style={{ cursor: 'pointer' }} />
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
