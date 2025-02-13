import React, { useEffect, useState } from 'react'
import { get } from '../../../../utils/AxiosUtils'
import SelectIcon from '../../Form/Select/SelectIcon'
import SelectMenu from '../../Form/Select/SelectMenu'
import Input from '../../Form/Input'
import { useParams } from 'react-router-dom'
import { processNotifications } from '../../../../utils/notificationUtils'
import { useDispatch } from 'react-redux'

function View() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [values, setValues] = useState(null);

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
  }, [dispatch, id]);

  const handleChange = (e) => {
    e.preventDefault()
  }

  return (
    <>
      <div className='card'>
        <div className='card-body'>
          <form encType={`multipart/form-data`} className=" row mt-3 g-3 needs-validation" noValidate>

            <Input name="name" label="Menu Name" value={values?.name} error={false} inputType={true} required={false} disabled={true} />
            <Input name="route" label="Route" value={values?.route} error={false} inputType={true} required={false} disabled={true} />

            <div className="col-md-4">
              <SelectIcon id="icon" value={values?.icon} handleChange={(e) => handleChange(e)} error={false} required={false} disabled={true} label='Icon' />
            </div>

            <div className="col-md-4">
              <SelectMenu id="parent" value={values?.parent} handleChange={(e) => handleChange(e)} error={false} required={false} disabled={true} label='Parent Menu' />
            </div>

            <div className="col-12">
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default View;
