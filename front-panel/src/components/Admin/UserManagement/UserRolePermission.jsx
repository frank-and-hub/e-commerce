import React, { useContext, useEffect, useState } from 'react'
import SubmitButton from '../Form/SubmitButton'
import { notifyInfo } from '../Comman/Notification/Notification'
import { get } from '../../../utils/AxiosUtils'
import { useFormValidation } from '../Form/FormValidation'
import validate from './Permission/validate'
import SelectForm from '../Form/Select/SelectForm'
import { useLoading } from '../../../context/LoadingContext'
import { ucwords } from '../../../utils/helper'
import PermissionTable from './Permission/PermissionTable'
import { SidebarContext } from '../../../context/SidebarContext'

function UserRolePermission() {

  const [userOptions, setUserOptions] = useState([]);
  const [userResponse, setUserResponse] = useState(false);
  const [showPermission, setShowPermission] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const { loading, setLoading } = useLoading();
  const { menus, selectUserData } = useContext(SidebarContext);

  const initialState = {
    user_id: ''
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
      const res = await get(`/users/${values.user_id}/permssions`);
      setUserResponse(res?.data);
      setShowPermission(true);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false)
    }
  };

  const resetForm = () => {
    setValues(initialState);
    setShowPermission(false);
    setFormKey((prevKey) => prevKey + 1);
    document.getElementsByTagName('form')[0].reset();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const Options = selectUserData?.data?.map((val, index) => ({
          value: val?.id,
          label: `${ucwords(val?.name)}`
        }));

        setUserOptions(Options || []);

      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false)
      }
    };
    fetchData();
  }, [setLoading, selectUserData]);

  const TableData = {
    response: menus?.data,
    permission: userResponse,
    user_id: values?.user_id,
    mainFormReset: resetForm
  }

  return (
    <>
      <div className='card'>
        <div className='card-body'>
          <form key={formKey} encType={`multipart/form-data`} className="row mt-3 g-3 needs-validation" onSubmit={handleSubmit} noValidate>
            <div className="col-md-4">
              <SelectForm id={`user_id`} value={values?.user_id} handleChange={(e) => { handleChange(e); }} error={errors.user_id} required={false} disabled={false} label='User' Options={userOptions} />
            </div>
            <div className="col-md-12">
              <SubmitButton className={`custom`} name={loading ? 'Loading...' : 'Apply Filter'} />
              <SubmitButton className={`secondary`} name={`Reset`} type='button' onClick={resetForm} />
            </div>
          </form>
        </div>
      </div>
      {showPermission && (<PermissionTable {...TableData} />)}
    </>
  )
}

export default UserRolePermission