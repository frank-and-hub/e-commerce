import React, { useEffect, useState } from 'react'
import { get } from '../../../../utils/AxiosUtils'
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
                const [serviceData] = await Promise.all([
                    get(`/designations/${id}`),
                ]);

                setValues(serviceData?.data || {});
                processNotifications(200, serviceData?.message, dispatch);
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
                        <Input name="name" label="Name" value={values?.name} onChange={handleChange} required={false} inputType={true} disabled={true} />
                        <div className="col-12">
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default View;
