import React, { useEffect, useState } from 'react'
import { useFormValidation } from '../../Form/FormValidation'
import validate from '../validate'
import SubmitButton from '../../Form/SubmitButton'
import Input from '../../Form/Input'
import { notifyError, notifySuccess, notifyInfo } from '../../Comman/Notification/Notification'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import SelectForm from '../../Form/Select/SelectForm'
import { formattedData } from '../../../../utils/helper'
import { processNotifications } from '../../../../utils/notificationUtils'
import { get, patch } from '../../../../utils/AxiosUtils'
import Textarea from '../../Form/Textarea'
import { useLoading } from '../../../../context/LoadingContext'
import { OptionsPaymentMethod, OptionsPaymentType } from '../../../../utils/selects'

function Edit() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);

    const initialState = {
        name: '',
        description: '',
        price: '',
        currency: '',
        payment_method: '',
        payment_type: '',
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
            const newValues = formattedData(values);
            const res = await patch(`/plans/${id}`, newValues);
            if (res) {
                resetForm()
                notifySuccess(res.message)
            }
            navigate('/plans', { replace: true })
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
                const [serviceData] = await Promise.all([
                    get(`/plans/${id}`),
                ]);

                setValues(serviceData?.data || {});

                processNotifications(200, serviceData?.message, dispatch);
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
                        <Input name="price" label="Price" value={values.price} onChange={handleChange} error={errors.price} required={true} inputType={true} />
                        <Input name="currency" label="Currency" value={values.currency} onChange={handleChange} error={errors.currency} required={true} inputType={true} />
                        <div className="col-md-4">
                            <SelectForm id="payment_method" value={values?.payment_method} handleChange={handleChange} error={errors.payment_method} required={true} disabled={false} label='Payment Method' Options={OptionsPaymentMethod} />
                        </div>
                        <div className="col-md-4">
                            <SelectForm id="payment_type" value={values?.payment_type} handleChange={handleChange} error={errors.payment_type} required={true} disabled={false} label='Payment Type' Options={OptionsPaymentType} />
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
