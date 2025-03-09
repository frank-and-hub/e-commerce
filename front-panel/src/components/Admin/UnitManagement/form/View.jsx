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

                const [unitData] = await Promise.all([
                    get(`/units/${id}`),
                ]);
                setValues(unitData?.data || {});
                processNotifications(200, unitData?.message, dispatch);
            } catch (err) {
                processNotifications(err.status || 500, err.message, dispatch);
            }
        };
        if (id) {
            fetchData();
        }
    }, [dispatch, setValues, id]);

    const handleChange = (e) => {
        e.preventDefault()
    }

    return (
        <>
            <div className={`card`}>
                <div className={`card-body`}>
                    <form encType={`multipart/form-data`} className={`row mt-3 g-3 needs-validation`} noValidate>

                        <Input name={`name`} label="Name" value={values?.name} onChange={handleChange} required={false} inputType={true} disabled={true} />
                        <Input name={`short_name`} label="Short Name" value={values?.short_name} onChange={handleChange} required={false} inputType={true} disabled={true} />

                        <div className={`col-12`}>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default View;
