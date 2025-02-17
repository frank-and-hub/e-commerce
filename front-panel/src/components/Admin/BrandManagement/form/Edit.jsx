import React, { useEffect, useState } from 'react'
import { useFormValidation } from '../../Form/FormValidation'
import validate from '../validate'
import SubmitButton from '../../Form/SubmitButton'
import Input from '../../Form/Input'
import { notifyError, notifySuccess, notifyInfo } from '../../Comman/Notification/Notification'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { checkFileValidation, formattedData } from '../../../../utils/helper'
import { processNotifications } from '../../../../utils/notificationUtils'
import { get, patch } from '../../../../utils/AxiosUtils'
import Textarea from '../../Form/Textarea'
import { useLoading } from '../../../../context/LoadingContext'
import api from '../../../../utils/api'
import config from '../../../../config'

function Edit() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);
    const [src, setSrc] = useState('');
    const baseUrl = config.reactApiUrl;

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
            // console.info(`Form validation failed : `);
            console.table(errors);
            return false;
        }
        setLoading(true)
        try {
            const newValues = formattedData(values);
            const res = await patch(`/brands/${id}`, newValues);
            if (res) {
                resetForm()
                notifySuccess(res.message)
            }
            navigate('/admin/brands', { replace: true })
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
                    get(`/brands/${id}/edit`),
                ]);

                setValues(serviceData?.data || {});
                setSrc(serviceData?.data?.image?.path);
                processNotifications(200, serviceData?.message, dispatch);
            } catch (err) {
                processNotifications(err.status || 500, err.message, dispatch);
            }
        };
        if (id) {
            fetchData();
        }
    }, [dispatch, setValues, id]);

    const handleFileUpload = async (e) => {
        const formData = checkFileValidation(e) ? e.target.files[0] : null;
        const imageUrl = URL.createObjectURL(formData);
        setSrc(imageUrl);
        values.image = formData;
        await api({
            method: 'post',
            url: `${baseUrl}/brands/${id}/image`,
            headers: {
                'Content-Type': 'multipart/form-data',
            }, data: values
        });
    };

    const handleClick = (e) => {
        document.getElementById('imageInput').click();
    };

    return (
        <>
            <div className='card'>
                <div className='card-body'>
                    <form key={formKey} encType={`multipart/form-data`} className="row mt-3 g-3 needs-validation" onSubmit={handleSubmit} noValidate>
                        <div className='col-md-4'>
                            <div className='cursor-none'>
                                <img src={src} alt={`Brand`} className={`rounded-25 col-md-6`} onClick={handleClick} style={{ cursor: 'pointer' }} />
                            </div>
                        </div>
                        <input type={`file`} id={`imageInput`} className={`d-none`} name={`image`} onChange={handleFileUpload} />
                        <Input name="name" label="Name" value={values.name} onChange={handleChange} error={errors.name} required={true} inputType={true} />
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
