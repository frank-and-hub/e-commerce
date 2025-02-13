import React, { useEffect, useState } from 'react'
import { useFormValidation } from '../../Form/FormValidation'
import validate from '../validate'
import SelectIcon from '../../Form/Select/SelectIcon'
import SelectMenu from '../../Form/Select/SelectMenu'
import SubmitButton from '../../Form/SubmitButton'
import Input from '../../Form/Input'
import { notifySuccess } from '../../Comman/Notification/Notification'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { processNotifications } from '../../../../utils/notificationUtils'
import { formattedData } from '../../../../utils/helper'
import { get, patch } from '../../../../utils/AxiosUtils'
import { useLoading } from '../../../../context/LoadingContext'

function Edit() {
  const { id } = useParams();
  const dispatch = useDispatch();
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
      const newValues = formattedData(values);
      const res = await patch(`/menus/${id}`, newValues);
      if (res) {
        resetForm()
      }
      notifySuccess(res.message)
      navigate('/menus', { replace: true })
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch roles and user data in parallel
        const [menuData] = await Promise.all([
          get(`/menus/${id}`),
        ]);

        setValues(menuData?.data || {});

        processNotifications(200, menuData?.message, dispatch);
      } catch (err) {

        processNotifications(err.status || 500, err.message, dispatch);
      }
    };
    if (id) {
      fetchData();
    }
  }, [dispatch, id, setValues]);

  return (
    <>
      <div className='card'>
        <div className='card-body'>
          <form key={formKey} encType={`multipart/form-data`} className="row mt-3 g-3 needs-validation" onSubmit={handleSubmit} noValidate>

            <Input name="name" label="Menu Name" value={values?.name} onChange={handleChange} error={errors.name} inputType={true} required={true} />
            <Input name="route" label="Route" value={values?.route} onChange={handleChange} error={errors.route} inputType={true} required={true} />

            <div className="col-md-4">
              <SelectIcon id="icon" value={values?.icon} handleChange={handleChange} error={errors.icon} required={true} disabled={false} label='Icon' />
            </div>

            <div className="col-md-4">
              <SelectMenu id="parent" value={values?.parent} handleChange={handleChange} error={errors.parent} required={true} disabled={false} label='Parent Menu' />
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
