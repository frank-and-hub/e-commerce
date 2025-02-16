import React, { useContext, useEffect, useState } from 'react'
import { get } from '../../../../utils/AxiosUtils'
import SelectIcon from '../../Form/Select/SelectIcon'
import Input from '../../Form/Input'
import Textarea from '../../Form/Textarea'
import { useParams } from 'react-router-dom'
import { processNotifications } from '../../../../utils/notificationUtils'
import { useDispatch } from 'react-redux'
import SelectForm from '../../Form/Select/SelectForm'
import { ucwords } from '../../../../utils/helper'
import { SidebarContext } from '../../../../context/SidebarContext'

function View() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [values, setValues] = useState(null);
    const { selectCategoryData } = useContext(SidebarContext);
    const [categoryDataOptions, setCategoryDataOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [getData] = await Promise.all([
                    get(`/sub-categories/${id}`),
                ]);
                setValues(getData?.data || {});
                const Options = selectCategoryData?.data?.map((val, index) => ({
                    value: val?.id,
                    label: `${ucwords(val?.name)}`
                }));
                setCategoryDataOptions(Options || []);
                processNotifications(200, getData?.message, dispatch);
            } catch (err) {
                processNotifications(err.status || 500, err.message, dispatch);
            }
        };
        if (id) {
            fetchData();
        }
    }, [dispatch, id, selectCategoryData]);

    const handleChange = (e) => {
        e.preventDefault()
    }

    return (
        <>
            <div className='card'>
                <div className='card-body'>
                    <form encType={`multipart/form-data`} className=" row mt-3 g-3 needs-validation" noValidate>
                        <Input name="name" label="Name" value={values?.name} onChange={handleChange} required={false} inputType={true} disabled={true} />
                        <div className="col-md-4">
                            <SelectIcon id="icon" value={values?.icon} handleChange={(e) => handleChange(e)} error={false} required={false} disabled={true} label='Icon' />
                        </div>
                        <div className="col-md-4">
                            <SelectForm id={`category`} label={`category`} value={values?.category?._id} handleChange={(e) => handleChange(e)} required={false} Options={categoryDataOptions} disabled={true} />
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
