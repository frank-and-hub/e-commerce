import React, { useEffect, useState } from 'react'
import { get } from '../../../../utils/AxiosUtils'
import SelectForm from '../../Form/Select/SelectForm'
import Input from '../../Form/Input'
import Textarea from '../../Form/Textarea'
import { useParams } from 'react-router-dom'
import { processNotifications } from '../../../../utils/notificationUtils'
import { useDispatch } from 'react-redux'
import { OptionsPaymentMethod, OptionsPaymentType } from '../../../../utils/selects'

function View() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [values, setValues] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [serviceData] = await Promise.all([
                    get(`/plans/${id}`),
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
                        <Input name="price" label="Price" value={values?.price} onChange={handleChange} required={false} inputType={true} disabled={true} />
                        <Input name="currency" label="Currency" value={values?.currency} onChange={handleChange} required={false} inputType={true} disabled={true} />
                        <div className="col-md-4">
                            <SelectForm id="payment_method" value={values?.payment_method} handleChange={handleChange} required={false} disabled={true} label='Payment Method' Options={OptionsPaymentMethod} />
                        </div>
                        <div className="col-md-4">
                            <SelectForm id="payment_type" value={values?.payment_type} handleChange={handleChange} required={false} disabled={true} label='Payment Type' Options={OptionsPaymentType} />
                        </div>
                        <Textarea name="description" className={`w-100`} label="Description" value={values?.description} onChange={handleChange} required={false} inputType={true} disabled={true} ></Textarea>
                        <div className="col-12">
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default View;
