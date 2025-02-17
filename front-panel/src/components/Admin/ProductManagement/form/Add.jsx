import React, { useContext, useEffect, useState } from 'react'
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
import { notifyError, notifySuccess, notifyInfo } from '../../Comman/Notification/Notification'
import { checkFileValidation, fetchSelectedOptions } from '../../../../utils/helper'
import { SidebarContext } from '../../../../context/SidebarContext'

function Add() {

    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);
    const [src, setSrc] = useState('');
    const navigate = useNavigate();
    const [tagDataOptions, setTagDataOptions] = useState([]);
    const [brandDataOptions, setBrandDataOptions] = useState([]);
    const [colorDataOptions, setColorDataOptions] = useState([]);
    const [discountataOptions, setDiscounDataOptions] = useState([]);
    const [categoryDataOptions, setCategoryDataOptions] = useState([]);
    const { selectCategoryData, selectBrandData, selectColorData, selectDiscountData, selectTagData } = useContext(SidebarContext);


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
        const categoryOptions = fetchSelectedOptions(selectCategoryData?.data);
        const brandOptions = fetchSelectedOptions(selectBrandData?.data);
        const colorOptions = fetchSelectedOptions(selectColorData?.data);
        const discountOptions = fetchSelectedOptions(selectDiscountData?.data);
        const tagOptions = fetchSelectedOptions(selectTagData?.data);
        setCategoryDataOptions(categoryOptions || []);
        setBrandDataOptions(brandOptions || []);
        setColorDataOptions(colorOptions || []);
        setDiscounDataOptions(discountOptions || []);
        setTagDataOptions(tagOptions || []);
    }, [src, selectCategoryData, selectBrandData, selectColorData, selectDiscountData, selectTagData]);

    return (
        <>
            <div className='card'>
                <div className='card-body'>
                    <form key={formKey} encType={`multipart/form-data`} className="row mt-3 g-3 needs-validation" onSubmit={handleSubmit} noValidate>
                        <Input name="name" label="Name" value={values?.name} onChange={handleChange} error={errors.name} required={true} inputType={true} />
                        <Input name={`price`} text={`price`} label="price" value={values?.price} onChange={handleChange} error={errors.price} required={true} inputType={true} />
                        <Input name={`quantity`} text={`quantity`} label="quantity" value={values?.quantity} onChange={handleChange} error={errors.quantity} required={true} inputType={true} />
                        <div className="col-md-4">
                            <SelectForm id={`brand_id`} label={`brand`} value={values.brand_id} handleChange={handleChange} error={errors.brand_id} required={true} Options={brandDataOptions} />
                        </div>
                        <div className="col-md-4">
                            <SelectForm id={`categories`} label={`categories`} value={values.categories} handleChange={handleChange} error={errors.categories} required={true} Options={categoryDataOptions} />
                        </div>
                        <div className="col-md-4">
                            <SelectForm id={`tags`} label={`tags`} value={values.tags} handleChange={handleChange} error={errors.tags} required={true} Options={tagDataOptions} />
                        </div>
                        <div className="col-md-4">
                            <SelectForm id={`color_id`} label={`color`} value={values.color_id} handleChange={handleChange} error={errors.color_id} required={true} Options={colorDataOptions} />
                        </div>
                        <div className="col-md-4">
                            <SelectForm id={`discount_id`} label={`discount`} value={values.discount_id} handleChange={handleChange} error={errors.discount_id} required={true} Options={discountataOptions} />
                        </div>
                        <Textarea name="description" className={`w-100`} label="description" value={values?.description} onChange={handleChange} error={errors.description} required={true} inputType={true} ></Textarea>
                        <Textarea name="specification" className={`w-100`} label="specification" value={values?.specification} onChange={handleChange} error={errors.specification} required={true} inputType={true} ></Textarea>
                        <input type={`file`} id={`imageInput`} className={`d-none`} name={`image`} onChange={handleFileUpload} />
                        <div className='col-md-4'>
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
