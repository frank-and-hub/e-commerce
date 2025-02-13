import React, { useState } from 'react';
import { notifySuccess } from '../../Comman/Notification/Notification'
import Input from '../../Form/Input'
import SubmitButton from '../../Form/SubmitButton'
import validate from './validate'
import { useFormValidation } from '../../Form/FormValidation'
import { patch } from '../../../../utils/AxiosUtils';
import { formattedData } from '../../../../utils/helper'
import Textarea from '../../Form/Textarea';
import { useLoading } from '../../../../context/LoadingContext';

function AccordionFrom({ value, onAction }) {

    const id = value?.id;
    const [formKey, setFormKey] = useState(0);
    const { loading, setLoading } = useLoading();

    const initialState = {
        question: value.question ?? '',
        answer: value.answer ?? ''
    };

    const { formData: values, errors, handleChange, handleSubmit: validateSubmit, setFormData: setValues } = useFormValidation(initialState, validate);

    const handleSubmit = async (e) => {
        e.preventDefault();
        validateSubmit(e);
        if (errors && Object.keys(errors).length > 0) {
            console.info(`Form validation failed : `);
            console.table(errors);
            return false;
        }
        setLoading(true)
        try {
            const newValues = formattedData(values);
            const res = await patch(`/faq/${id}`, newValues);
            if (res) {
                resetForm()
                notifySuccess(res.message)
            }
        } catch (err) {
            console.error(err.message);
            console.error(err.message);
        } finally {
            setLoading(false)
        }
    };

    const resetForm = () => {
        setValues(initialState);
        onAction(false);
        setFormKey((prevKey) => prevKey + 1);
    };

    return (
        <>
            <form key={formKey} encType={`multipart/form-data`} className="row m-0 needs-validation" onSubmit={handleSubmit} noValidate>
                <div className='d-none'>
                    <Input values={values?.question} name={`question`} onChange={handleChange} required={false} disabled={false} inputType={true} error={errors.question} />
                </div>
                <Textarea border={`0`} label={null} onChange={handleChange} className={`w-100`} name={`answer`} value={values?.answer} />
                <div className="col-12 text-end">
                    <SubmitButton className={`custom`} name={loading ? 'Submitting...' : 'Submit Form'} />
                </div>
            </form>
        </>
    );
}

export default AccordionFrom;