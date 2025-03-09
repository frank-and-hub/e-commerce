import React, { useEffect, useState } from 'react'
import { get } from '../../../../utils/AxiosUtils'
import Input from '../../Form/Input'
import { useParams } from 'react-router-dom'
import { processNotifications } from '../../../../utils/notificationUtils'
import { useDispatch } from 'react-redux'
import SelectForm from '../../Form/Select/SelectForm'
import Textarea from '../../Form/Textarea'
import { PeriodOptions } from '../../../../utils/selects'

function View() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [values, setValues] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const [WarrantyData] = await Promise.all([
                    get(`/warranties/${id}`),
                ]);
                setValues(WarrantyData?.data || {});
                processNotifications(200, WarrantyData?.message, dispatch);
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
                        <Input name={`duration`} label="duration" value={values?.duration} onChange={handleChange} required={false} inputType={true} disabled={true} />
                        <div className={`col-md-4`}>
                            <SelectForm id="period" label={`Period`} value={values?.period} handleChange={handleChange} required={false} Options={PeriodOptions} disabled={true} />
                        </div>
                        <Textarea onChange={handleChange} className={`w-100`} name={`description`} value={values?.description}  label={`Description`} required={false} disabled={true} />

                        <div className={`col-12`}>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default View;
