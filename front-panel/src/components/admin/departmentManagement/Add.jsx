import React, { useEffect, useState } from 'react'
import { get, post } from 'utils/AxiosUtils'
import SelectPermission from 'components/admin/form/select/SelectPermission'
import SubmitButton from 'components/admin/form/SubmitButton'
import Input from 'components/admin/form/Input'
import { notifyError, notifySuccess, notifyInfo } from 'components/admin/comman/notification/Notification'
import { useNavigate } from 'react-router-dom'
import { useLoading } from 'context/LoadingContext'
import CardForm from 'components/admin/card/CardForm'
import { roleValidation, useFormValidation } from 'utils/FormValidation'
import SelectIcon from 'components/admin/form/select/SelectIcon'
import SelectForm from 'components/admin/form/select/SelectForm'
import { useSelector } from 'react-redux'
import { ucwords } from 'utils/helper'

function Add() {

    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);
    const navigate = useNavigate();
    const [hodUserData, setHodUSerData] = useState([]);

    const roles = useSelector((state) => (state?.role?.role));
console.log(roles)
    const hod_role_id = roles?.data
        ?.filter((option) => option.name === 'hod')
        ?.map((option) => option.id)[0];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await get(`/users?role_id=${hod_role_id}`);
                const userOptions = res?.response?.data?.map((item) => ({
                    value: item?.id,
                    label: `${ucwords(item?.name)}`
                }));

                setHodUSerData(userOptions || []);
            } catch (err) {
                console.error(err.message);
                setHodUSerData([]);
            }
        };

        if (hod_role_id) {
            fetchData();
        }
    }, [hod_role_id]);

    const initialState = {
        name: '',
        icon: '',
        hod_id: '',
        permissions: []
    };

    const { formData: values, errors, handleChange, handleSubmit: validateSubmit, setFormData: setValues } = useFormValidation(initialState, roleValidation);

    const handleSubmit = async (e) => {
        e.preventDefault();
        notifyInfo(values);
        validateSubmit(e);
        if (errors && Object.keys(errors).length > 0) {
            console.table(errors);
            return false;
        }
        setLoading(true)
        try {
            const res = await post('/departments', values);
            if (res) {
                resetForm()
                notifySuccess(res.message)
                navigate('/admin/departments', { replace: true })
            }
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

    return (
        <CardForm handleSubmit={handleSubmit} key={formKey}>
            <Input name={`name`} label="Name" value={values.name} onChange={handleChange} error={errors.name} required={true} inputType={true} />

            <div className={`col-md-4`}>
                <SelectIcon id="icon" label={`Icon`} value={values.icon} handleChange={handleChange} error={errors.icon} required={true} />
            </div>

            <div className={`col-md-4`}>
                <SelectForm id="hod_id" label={`h o d`} value={values.hod_id} handleChange={handleChange} error={errors.hod_id} required={true} Options={hodUserData} />
            </div>

            <div className={`col-md-4`}>
                <SelectPermission id="permissions" value={values.permissions} handleChange={handleChange} error={errors.permissions} required={true} disabled={false} label='Permissions' />
            </div>
            <div className={`col-12`}>
                <SubmitButton className={`custom`} disable={loading} name={loading ? 'Submitting...' : 'Submit Form'} />
            </div>
        </CardForm>
    );
}

export default Add;
