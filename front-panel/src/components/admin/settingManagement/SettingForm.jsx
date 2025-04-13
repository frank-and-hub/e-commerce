import React, { useEffect, useState } from 'react'
import CardForm from 'components/admin/card/CardForm'
import Input from 'components/admin/form/Input';
import SubmitButton from 'components/admin/form/SubmitButton';
import { useFormValidation } from 'utils/FormValidation';
import { useLoading } from 'context/LoadingContext';
import { notifyError, notifyInfo, notifySuccess } from 'components/admin/comman/notification/Notification';
import { useNavigate } from 'react-router-dom';
import { get, post } from 'utils/AxiosUtils';
import SelectForm from 'components/admin/form/select/SelectForm';
import { OptionsThemeType } from 'utils/selects';

const SettingForm = () => {
    const [formKey, setFormKey] = useState(0);
    const { loading, setLoading } = useLoading();
    const navigate = useNavigate();

    const initialState = {
        color: '#967ADC',
        background: '#ffffff',
        theme: '',
        grayscale: false,
        grayscale_percentage: '',
        invert: false,
        invert_percentage: '',
        saturate: false,
        saturate_percentage: '',
        contrast: false,
        contrast_percentage: '',
        sepia: false,
        sepia_percentage: '',
    };

    const validation = () => {
        let errors = {}
        if (!values.color) errors.color = 'Please enter system color';
        return errors;
    }

    const { formData: values, errors, handleChange, handleSubmit: validateSubmit, setFormData: setValues } = useFormValidation(initialState, validation);

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
            const res = await post(`/settings`, values);
            if (res) {
                setFormKey(res.data.id);
                notifySuccess(res.message)
                navigate('/admin/settings', { replace: true })
                window.location.reload();
            }
        } catch (err) {
            notifyError(err.message)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [getSettingData] = await Promise.all([
                    get(`/settings`),
                ]);

                setValues(getSettingData?.data || {});
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [setValues]);

    return (
        <>
            <CardForm handleSubmit={handleSubmit} key={formKey}>
                <Input name={`color`} type='color' label="color" value={values.color} onChange={handleChange} required={true} error={errors.color} inputType={true} disabled={false} />
                <Input name={`background`} type='color' label="theam background" value={values.background} onChange={handleChange} required={true} error={errors.background} inputType={true} disabled={false} />
                
                <div className={`col-md-4`}>
                    <SelectForm id="theme" label={`theme`} value={values.theme} handleChange={handleChange} error={errors.theme} required={false} Options={OptionsThemeType} />
                </div>

                <Input checked={values.grayscale} name={`grayscale`} type='checkbox' label="grayscale" value={values.grayscale} onChange={handleChange} required={false} error={errors.grayscale} inputType={true} disabled={false} />
                {values.grayscale && (
                    <div className={`col-md-8`}>
                        <Input name={`grayscale_percentage`} type='range' label="grayscale_percentage" value={values.grayscale_percentage} onChange={handleChange} required={false} error={errors.grayscale_percentage} inputType={false} disabled={false} min={`0`} max={`100`}/>
                    </div>
                )}

                <Input checked={values.invert} name={`invert`} type='checkbox' label="invert" value={values.invert} onChange={handleChange} required={false} error={errors.invert} inputType={true} disabled={false} />
                {values.invert && (
                    <div className={`col-md-8`}>
                        <Input name={`invert_percentage`} type='range' label="invert_percentage" value={values.invert_percentage} onChange={handleChange} required={false} error={errors.invert_percentage} inputType={false} disabled={false} min={`0`} max={`100`}/>
                    </div>
                )}

                <Input checked={values.saturate} name={`saturate`} type='checkbox' label="saturate" value={values.saturate} onChange={handleChange} required={false} error={errors.saturate} inputType={true} disabled={false} />
                {values.saturate && (
                    <div className={`col-md-8`}>
                        <Input name={`saturate_percentage`} type='range' label="saturate_percentage" value={values.saturate_percentage} onChange={handleChange} required={false} error={errors.saturate_percentage} inputType={false} disabled={false} min={`0`} max={`100`}/>
                    </div>
                )}

                <Input checked={values.contrast} name={`contrast`} type='checkbox' label="contrast" value={values.contrast} onChange={handleChange} required={false} error={errors.contrast} inputType={true} disabled={false} />
                {values.contrast && (
                    <div className={`col-md-8`}>
                        <Input name={`contrast_percentage`} type='range' label="contrast_percentage" value={values.contrast_percentage} onChange={handleChange} required={false} error={errors.contrast_percentage} inputType={false} disabled={false} min={`0`} max={`100`}/>
                    </div>
                )}

                <Input checked={values.sepia} name={`sepia`} type='checkbox' label="sepia" value={values.sepia} onChange={handleChange} required={false} error={errors.sepia} inputType={true} disabled={false} />
                {values.sepia && (
                    <div className={`col-md-8`}>
                        <Input name={`sepia_percentage`} type='range' label="sepia_percentage" value={values.sepia_percentage} onChange={handleChange} required={false} error={errors.sepia_percentage} inputType={false} disabled={false} min={`0`} max={`100`}/>
                    </div>
                )}
                
                <div className={`col-12`}>
                    <SubmitButton className={`custom`} name={loading ? 'Updating...' : 'Update Form'} />
                </div>
            </CardForm>
        </>
    )
}

export default SettingForm