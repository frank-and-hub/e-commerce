import React, { useEffect, useState } from 'react'
import { useFormValidation } from '../../Form/FormValidation'
import validate from '../validate'
import SubmitButton from '../../Form/SubmitButton'
import Input from '../../Form/Input'
import { notifyError, notifySuccess, notifyInfo } from '../../Comman/Notification/Notification'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import SelectIcon from '../../Form/Select/SelectIcon'
import { formattedData } from '../../../../utils/helper'
import { processNotifications } from '../../../../utils/notificationUtils'
import { get, patch } from '../../../../utils/AxiosUtils'
import Textarea from '../../Form/Textarea'
import { useLoading } from '../../../../context/LoadingContext'

function Edit() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);

    const initialState = {
        name: '',
        icon: '',
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
            const newValues = formattedData(values);
            const res = await patch(`/categories/${id}`, newValues);
            if (res) {
                resetForm()
                notifySuccess(res.message)
            }
            navigate('/admin/products/categories', { replace: true })
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [getData] = await Promise.all([
                    get(`/categories/${id}/edit`),
                ]);

                setValues(getData?.data || {});

                processNotifications(200, getData?.message, dispatch);
            } catch (err) {
                processNotifications(err.status || 500, err.message, dispatch);
            }
        };
        if (id) {
            fetchData();
        }
    }, [dispatch, setValues, id]);

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
                        <Textarea name="description" className={`w-100`} label="Description" value={values?.description} onChange={handleChange} error={errors.description} required={true} inputType={true} ></Textarea>
                        <div className="col-12">
                            <SubmitButton className={`custom`} name={loading ? 'Updating...' : 'Update Form'} />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Edit;
