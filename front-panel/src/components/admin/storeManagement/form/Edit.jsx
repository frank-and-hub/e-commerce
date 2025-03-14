import React, { useEffect, useState } from 'react'
import { useFormValidation } from '../../form/FormValidation'
import { get, patch } from '../../../../utils/AxiosUtils'
import validate from '../validate'
import SubmitButton from '../../form/SubmitButton'
import Input from '../../form/Input'
import { notifyError, notifySuccess, notifyInfo } from '../../comman/notification/Notification'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { processNotifications } from '../../../../utils/notificationUtils'
import { formattedData } from '../../../../utils/helper'
import { useLoading } from '../../../../context/LoadingContext'
import Textarea from '../../form/Textarea'
import CardForm from '../../card/CardForm'

function Edit() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);

    const initialState = {
        name: ``,
        phone: ``,
        email: ``,
        address: ``,
        city: ``,
        state: ``,
        zipcode: ``,
        country: ``,
        supplier: ``
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
            const res = await patch(`/stores/${id}`, newValues);
            if (res) {
                resetForm()
                notifySuccess(res.message)
            }
            navigate('/storage/stores', { replace: true })
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
                const [tagData] = await Promise.all([
                    get(`/stores/${id}/edit`),
                ]);
                setValues(tagData?.data || {});
                processNotifications(200, tagData?.message, dispatch);
            } catch (err) {
                processNotifications(err.status || 500, err.message, dispatch);
            }
        };
        if (id) {
            fetchData();
        }
    }, [dispatch, setValues, id]);

    return (
        <CardForm handleSubmit={handleSubmit} key={formKey}>
            <Input name={`name`} label="name" value={values?.name} onChange={handleChange} error={errors.name} required={true} inputType={true} />
            <Input name={`phone`} label="phone" value={values?.phone} onChange={handleChange} error={errors.phone} required={true} inputType={true} />
            <Input name={`email`} label="email" value={values?.email} onChange={handleChange} error={errors.email} required={true} inputType={true} />
            <Input name={`country`} label="country" value={values?.country} onChange={handleChange} error={errors.country} required={true} inputType={true} />
            <Input name={`state`} label="state" value={values?.state} onChange={handleChange} error={errors.state} required={true} inputType={true} />
            <Input name={`city`} label="city" value={values?.city} onChange={handleChange} error={errors.city} required={true} inputType={true} />
            <Input name={`zipcode`} label="zipcode" value={values?.zipcode} onChange={handleChange} error={errors.zipcode} required={true} inputType={true} />
            <Textarea name={`address`} label="address" value={values?.address} onChange={handleChange} error={errors.address} required={true} inputType={true} ></Textarea>
            <div className={`col-12`}>
                <SubmitButton className={`custom`} name={loading ? 'Updating...' : 'Update Form'} />
            </div>
        </CardForm>
    );
}

export default Edit;
