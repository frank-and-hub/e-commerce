import React, { useState } from 'react'
import { useFormValidation } from '../../Form/FormValidation'
import { post } from '../../../../utils/AxiosUtils'
import validate from '../validate'
import SelectIcon from '../../Form/Select/SelectIcon'
import SelectMenu from '../../Form/Select/SelectMenu'
import SubmitButton from '../../Form/SubmitButton'
import Input from '../../Form/Input'
import { notifySuccess } from '../../Comman/Notification/Notification'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '../../../../context/LoadingContext'

function Add() {

  const { loading, setLoading } = useLoading();
  const [formKey, setFormKey] = useState(0);
  const navigate = useNavigate();

  const initialState = {
    name: '',
    route: '',
    icon: '',
    parent: ''
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
      const res = await post('/menus', values);
      if (res) {
        resetForm()
        navigate('/menus', true);
      }
      notifySuccess(res.message)
    } catch (err) {
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

            <Input name="name" label="Menu Name" value={values.name} onChange={handleChange} error={errors.name} inputType={true} required={true} />
            <Input name="route" label="Route" value={values.route} onChange={handleChange} error={errors.route} inputType={true} required={true} />

            <div className="col-md-4">
              <label htmlFor="icon" className="form-label">Icon <span className='text-danger'>*</span></label>
              <SelectIcon id="icon" value={values.icon} handleChange={handleChange} error={errors.icon} />
              {errors.icon && <div className="invalid-feedback">{errors.icon}</div>}
            </div>

            <div className="col-md-4">
              <label htmlFor="parent" className="form-label">Parent Menu</label>
              <SelectMenu id="parent" value={values.parent} handleChange={handleChange} error={errors.parent} required={false} disabled={false} />
              {errors.parent && <div className="invalid-feedback">{errors.parent}</div>}
            </div>

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
