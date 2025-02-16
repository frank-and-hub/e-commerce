import React, { useContext, useEffect, useState } from 'react'
import { useFormValidation } from '../../Form/FormValidation'
import { post } from '../../../../utils/AxiosUtils'
import validate from '../validate'
import SubmitButton from '../../Form/SubmitButton'
import Input from '../../Form/Input'
import { notifyError, notifySuccess, notifyInfo } from '../../Comman/Notification/Notification'
import SelectIcon from '../../Form/Select/SelectIcon'
import Textarea from '../../Form/Textarea'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '../../../../context/LoadingContext'
import SelectForm from '../../Form/Select/SelectForm'
import { SidebarContext } from '../../../../context/SidebarContext'
import { ucwords } from '../../../../utils/helper'

function Add() {
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);
    const [categoryDataOptions, setCategoryDataOptions] = useState([]);
    const { selectCategoryData } = useContext(SidebarContext);

    const initialState = {
        name: '',
        icon: '',
        category: '',
        description: ''
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

    useEffect(() => {
        const fetchData = async () => {
            const Options = selectCategoryData?.data?.map((val, index) => ({
                value: val?.id,
                label: `${ucwords(val?.name)}`
            }));
            setCategoryDataOptions(Options || []);
        }
        fetchData();
    }, [selectCategoryData]);

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
                            <label htmlFor="icon" className="form-label">Icon <span className='text-danger'>*</span></label>
                            <SelectIcon id="icon" value={values.icon} handleChange={handleChange} error={errors.icon} />
                            {errors.icon && <div className="invalid-feedback">{errors.icon}</div>}
                        </div>
                        <div className="col-md-4">
                            <SelectForm id={`category`} label={`category`} value={values.category} handleChange={handleChange} error={errors.category} required={true} Options={categoryDataOptions} />
                        </div>
                        <Textarea name="description" className={`w-100`} label="Description" value={values?.description} onChange={handleChange} error={errors.description} required={true} inputType={true} ></Textarea>
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
