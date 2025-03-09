import React, { useEffect, useState } from 'react'
import { useFormValidation } from '../../Form/FormValidation'
import { get, patch } from '../../../../utils/AxiosUtils'
import validate from '../validate'
import SubmitButton from '../../Form/SubmitButton'
import Input from '../../Form/Input'
import { notifyError, notifySuccess, notifyInfo } from '../../Comman/Notification/Notification'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { processNotifications } from '../../../../utils/notificationUtils'
import { formattedData } from '../../../../utils/helper'
import { useLoading } from '../../../../context/LoadingContext'
import { PeriodOptions } from '../../../../utils/selects'
import SelectForm from '../../Form/Select/SelectForm'
import Textarea from '../../Form/Textarea'

function Edit() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);

    const initialState = {
        name: '',
        duration: '',
        period: '',
        description: '',
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
            const res = await patch(`/warranties/${id}`, newValues);
            if (res) {
                resetForm()
                notifySuccess(res.message)
            }
            navigate('/admin/warranties', { replace: true })
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
                const [WarrantyData] = await Promise.all([
                    get(`/warranties/${id}/edit`),
                ]);
                setValues(WarrantyData?.data || {});
                processNotifications(200, WarrantyData?.message, dispatch);
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
            <div className={`card`}>
                <div className={`card-body`}>
                    <form key={formKey} encType={`multipart/form-data`} className={`row mt-3 g-3 needs-validation`} onSubmit={handleSubmit} noValidate>

                        <Input name={`name`} label="Name" value={values?.name} onChange={handleChange} required={true} error={errors.name} inputType={true} disabled={false} />
                        <Input name={`duration`} label="duration" value={values?.duration} onChange={handleChange} error={errors.duration} required={true} inputType={true} />
                        <div className={`col-md-4`}>
                            <SelectForm id="period" label={`Period`} value={values?.period} handleChange={handleChange} error={errors.period} required={false} Options={PeriodOptions} />
                        </div>
                        <Textarea onChange={handleChange} className={`w-100`} name={`description`} value={values?.description} error={errors.description} label={`Description`} required={true} disabled={false} />

                        <div className={`col-12`}>
                            <SubmitButton className={`custom`} name={loading ? 'Updating...' : 'Update Form'} />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Edit;
