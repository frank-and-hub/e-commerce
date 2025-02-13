import React, { useEffect, useState } from 'react'
import config from '../../../../config'

import { get, patch } from '../../../../utils/AxiosUtils'
import { useFormValidation } from '../../Form/FormValidation'

import validate from '../validate'
import Input from '../../Form/Input'
import Textarea from '../../Form/Textarea'
import SubmitButton from '../../Form/SubmitButton'
import SelectForm from '../../Form/Select/SelectForm'

import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { OptionsProjectType } from '../../../../utils/selects'
import { useLoading } from '../../../../context/LoadingContext'
import { processNotifications } from '../../../../utils/notificationUtils'
import { checkFileValidation, formattedData } from '../../../../utils/helper'
import { notifyError, notifySuccess, notifyInfo } from '../../Comman/Notification/Notification'
import api from '../../../../utils/api'

function Edit() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [src, setSrc] = useState('');
    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);

    const baseUrl = config.reactApiUrl;

    const initialState = {
        name: '',
        description: '',
        url: '',
        type: ''
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

            const res = await patch(`/projects/${id}`, newValues, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res) {
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

        const res = await api({
            method: 'post',
            url: `${baseUrl}/projects/${id}/image`,
            headers: {
                'Content-Type': 'multipart/form-data',
            }, data: {
                image: formData
            }
        });

        if (res) {
            setSrc(imageUrl);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {

                const [projectData] = await Promise.all([
                    get(`/projects/${id}`),
                ]);

                setValues(projectData?.data || {});
                setSrc(projectData?.data?.image?.path);

                processNotifications(200, projectData?.message, dispatch);
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

                        <Input name="name" label="Name" value={values?.name} onChange={handleChange} error={errors.name} required={true} inputType={true} />
                        <Input name={`url`} text={`url`} label="Url" value={values?.url} onChange={handleChange} error={errors.url} required={true} inputType={true} />
                        <div className="col-md-4">
                            <SelectForm id="type" value={values?.type} handleChange={handleChange} error={errors.type} required={true} disabled={false} label='Type' Options={OptionsProjectType} />
                        </div>
                        <Textarea name="description" className={`w-100`} label="Description" value={values?.description} onChange={handleChange} error={errors.description} required={true} inputType={true} ></Textarea>
                        <input type={`file`} id={`imageInput`} className={`d-none`} name={`image`} onChange={handleFileUpload} />
                        <div className='col-md-6'>
                            <div className='cursor-none'>
                                <img src={src} alt={`Project`} className={`rounded-25 w-100`} onClick={handleClick} style={{ cursor: 'pointer' }} />
                            </div>
                        </div>
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
