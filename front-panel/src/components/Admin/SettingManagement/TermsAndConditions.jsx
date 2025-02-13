import React, { useEffect, useState } from 'react'
import SubmitButton from '../Form/SubmitButton'
import { get, post } from '../../../utils/AxiosUtils'
import { notifyError, notifySuccess } from '../Comman/Notification/Notification'
import { useFormValidation } from '../Form/FormValidation'
import Textarea from '../Form/Textarea'
import { processNotifications } from '../../../utils/notificationUtils'
import { useDispatch } from 'react-redux'
import { useLoading } from '../../../context/LoadingContext'

const TermsAndConditions = () => {
    const dispatch = useDispatch();
    const [inState, setInState] = useState(false);
    
    const [formKey, setFormKey] = useState(0);
    const [response, setResponse] = useState(null);
    const { loading, setLoading } = useLoading();
    const [error, setError] = useState(null);

    const initialState = {
        t_and_c: response?.t_and_c ?? '',
    };

    const validate = (values) => {
        let errors = {};
        if (!values.t_and_c) errors.t_and_c = 'Please enter terms and conditions';
        return errors;
    };

    const {
        formData: values,
        errors,
        handleChange,
        handleSubmit: validateSubmit,
        setFormData: setValues
    } = useFormValidation(initialState, validate);

    const handleSubmit = async (e) => {
        e.preventDefault();

        validateSubmit(e);
        if (errors && Object.keys(errors).length > 0) {
            notifyError('Form validation failed', errors);
            return false;
        }
        setLoading(true)
        try {
            const res = await post('/terms-and-conditions', values);
            setResponse(res.data);
            setInState(false);
            notifySuccess(res.message)
        } catch (err) {
            notifyError(err.message)
            setError(err.message);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const reqData = await get('/terms-and-conditions');
                const fetchedData = reqData?.response?.data[0] || {};
                setResponse(fetchedData);
                setValues(fetchedData);
                processNotifications(200, reqData?.message, dispatch);
            } catch (err) {
                processNotifications(err.status || 500, err.message, dispatch);
                setError(err.message || 'Failed to fetch data');
            } finally {
                setLoading(false)
                setInState(false);
            }
        };

        fetchData();
    }, [dispatch, setLoading, setValues]);

    useEffect(() => {
        setFormKey(response?.id);
    }, [response]);

    return (
        <>
            <section className={`section`}>
                <div className={`card-head`}>
                    <div className={`card-title`}>
                        <p className='p-0 m-0 btn' onClick={() => (setInState(!inState))} > Terms And Conditions </p>
                    </div>
                </div>
                <div className='card'>
                    <div className='card-body'>
                        {!loading && (!inState
                            ? (<div className='p-3 text-capitalize'>
                                {values.t_and_c ?? response?.t_and_c}
                            </div>)
                            : (
                                <form key={formKey} encType={`multipart/form-data`} className="row mt-1 g-4 needs-validation" onSubmit={handleSubmit} noValidate>
                                    <Textarea border={`0`} editor={true} name={`t_and_c`} className={`w-100`} onChange={handleChange} disabled={!inState} required={!inState} value={values?.t_and_c ?? response?.t_and_c} label={null} error={error?.t_and_c} />
                                    <div className="col-12">
                                        {inState && (
                                            <SubmitButton className={`custom`} name={!loading ? 'Updating...' : 'Update Form'} />
                                        )}
                                    </div>
                                </form>
                            ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default TermsAndConditions