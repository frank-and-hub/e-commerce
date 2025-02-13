import React, { useEffect, useState } from 'react'
import Input from '../../Form/Input'
import { useParams } from 'react-router-dom'
import SelectRole from '../../Form/Select/SelectRole'
import { get } from '../../../../utils/AxiosUtils'
import { useDispatch } from 'react-redux'
import { processNotifications } from '../../../../utils/notificationUtils'
import SelectDesignation from '../../Form/Select/SelectDesignation'

function View() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [values, setValues] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch roles and user data in parallel
                const [userData] = await Promise.all([
                    get(`/users/${id}`),
                ]);
                setValues(userData?.data || {});
                processNotifications(200, userData?.message, dispatch);
            } catch (err) {
                processNotifications(err.status || 500, err.message, dispatch);
            }
        };

        if (id) {
            fetchData();
        }
    }, [dispatch, id]);

    const handleChange = async (e) => {
        e.preventDefault();
    }

    return (
        <>
            {values && (<div className='card'>
                <div className='card-body'>
                    <form encType={`multipart/form-data`} className=" row mt-3 g-4 needs-validation" noValidate>
                        <Input name="name" label="User Name" value={values?.name} required={false} inputType={true} disabled={true} />
                        <Input name="email" label="Email" type="email" value={values?.email} required={false} inputType={true} disabled={true} />
                        <Input name="password" label="Password" value={values?.password_text} required={false} inputType={true} disabled={true} />
                        <Input name="phone" label="Phone" value={values?.phone} required={false} inputType={true} disabled={true} />
                        <div className="col-md-4">
                            <SelectRole id={`role_id`} value={values?.role?._id} required={false} disabled={true} label='role' handleChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                            <SelectDesignation id={`designations`} label={`Designations`} value={values?.designations} handleChange={(e) => handleChange(e)} required={false} disabled={true} />
                        </div>
                        <div className="col-12">
                        </div>
                    </form>
                </div>
            </div>)}
        </>
    );
}

export default View;
