import React, { useState } from 'react'
import { useFormValidation } from '../../Form/FormValidation'
import { post } from '../../../../utils/AxiosUtils'
import validate from './validate'
import SubmitButton from '../../Form/SubmitButton'
import { notifySuccess } from '../../Comman/Notification/Notification'
import { useNavigate } from 'react-router-dom'
import Textarea from '../../Form/Textarea'
import { useLoading } from '../../../../context/LoadingContext'

function Add() {

  const { loading, setLoading } = useLoading();
  const [formKey, setFormKey] = useState(0);
  const navigate = useNavigate();

  const initialState = {
    question: '',
    answer: ''
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
      const res = await post('/faq', values);
      if (res) {
        resetForm()
        notifySuccess(res.message)
        navigate('/settings/faqs', true);
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
    setFormKey((prevKey) => prevKey + 1);
    document.getElementsByTagName('form')[0].reset();
  };
  return (
    <>
      <div className='card'>
        <div className='card-body'>
          <form key={formKey} encType={`multipart/form-data`} className="row mt-3 g-3 needs-validation" onSubmit={handleSubmit} noValidate>
            <Textarea name="question" label="Question" value={values.question} className={`w-100`} onChange={handleChange} error={errors.question} inputType={true} required={true} />
            <Textarea name="answer" label="Answer" value={values.answer} className={`w-100`} onChange={handleChange} error={errors.answer} inputType={true} required={true} />
            <div className="col-12">
              <SubmitButton className={`custom`} name={loading ? 'Submitting...' : 'Submit Form'} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Add;
