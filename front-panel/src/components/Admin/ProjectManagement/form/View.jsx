import React, { useEffect, useState } from 'react'
import { get } from '../../../../utils/AxiosUtils'
import Input from '../../Form/Input'
import { useParams } from 'react-router-dom'
import { processNotifications } from '../../../../utils/notificationUtils'
import { useDispatch } from 'react-redux'
import SelectForm from '../../Form/Select/SelectForm'
import { OptionsProjectType } from '../../../../utils/selects'

function View() {
    const [src, setSrc] = useState('');
    const { id } = useParams();
    const dispatch = useDispatch();
    const [values, setValues] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch projects and user data in parallel
                const [projectData] = await Promise.all([
                    get(`/projects/${id}`),
                ]);
                setValues(projectData?.data || {});

                setSrc(projectData?.data?.image?.path);

                processNotifications(200, projectData?.message, dispatch);
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
                        <Input name={`url`}  text={`url`} label="Url" value={values?.url} onChange={handleChange} required={false} inputType={true} disabled={true} />
                        <div className="col-md-4">
                            <SelectForm id="type" value={values?.type} handleChange={handleChange} required={false} disabled={true} label='Type' Options={OptionsProjectType} />
                        </div>
                        <div className={`col-md-12`} >
                            <label for="description" className={`form-label`} >Description </label>
                            <div className='text-start'>
                                {values?.description}
                            </div>
                        </div>

                        <div className='col-md-8'>
                            <div className=''>
                                <img src={src} alt={``} className="rounded-25" style={{ cursor: 'disabled' }} />
                            </div>
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
