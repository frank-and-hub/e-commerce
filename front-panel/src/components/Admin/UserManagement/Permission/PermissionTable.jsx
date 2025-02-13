import React, { useEffect, useState } from 'react'
import SubmitButton from '../../Form/SubmitButton'
import { useLoading } from '../../../../context/LoadingContext'
import { notifySuccess } from '../../Comman/Notification/Notification'
import { post } from '../../../../utils/AxiosUtils'
import { useFormValidation } from '../../Form/FormValidation'
import { transformData, ucwords } from '../../../../utils/helper'
import { useNavigate } from 'react-router-dom'

export const PermissionTable = ({ response, permission, user_id = null, mainFormReset }) => {
    const { loading, setLoading } = useLoading();
    const [formKey, setFormKey] = useState(0);
    const [toggle, setToggle] = useState(false);
    const navigate = useNavigate();

    const columnCount = `7`;

    const validate = (values) => {
        let errors = {};
        return errors;
    }

    const initialState = {};

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
            if (user_id) {
                const res = await post(`/users/${user_id}/permssions`, transformData(values));
                notifySuccess(res.message)
            }
            navigate('/users/permissions', { replace: true })
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false)
            resetForm()
            mainFormReset()
        }
    };

    const resetForm = () => {
        setValues(initialState);
        setFormKey((prevKey) => prevKey + 1);
        document.getElementsByTagName('form')[0].reset();
    };

    useEffect(() => {
        if (response?.length > 0) {
            const initialValues = response.reduce((acc, curr, k) => {
                acc[`menu[${k}]`] = curr.id;
                return acc;
            }, {});
            setValues((prev) => ({ ...prev, ...initialValues }));
        }
    }, [response, setValues]);

    console.log(`toggle is ${toggle}`)

    return (
        <>
            <div className='card'>
                <div className={`card-head`}></div>
                <div className='card-body' >
                    <form key={formKey} className="row mt-3 px-3 g-4 needs-validation" onSubmit={handleSubmit} noValidate>
                        <table className={`table table-borderless table-sm`}>
                            <thead>
                                <tr key={formKey}  >
                                    <th><i className="bi bi-hash" ></i></th>
                                    <th>Menu Name</th>
                                    <th>View</th>
                                    <th>Add</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    <th className={`p-0`} ><i
                                        data-toggle={`tooltip`}
                                        title='Checked All'
                                        className={`bi bi-toggle-${toggle ? 'on' : 'off'} coursor-pointer`}
                                        onClick={(e) => setToggle(!toggle)}
                                        style={{ fontSize: '20px' }}
                                    ></i></th>
                                </tr>
                            </thead>
                            <tbody>
                                {response && response.length > 0 ? (
                                    response.map((value, k) => {
                                        const isChecked = (field) => permission?.[k]?.[field] === true;
                                        return (<tr>
                                            <td>{k + 1}</td>
                                            <td>{ucwords(value.name)}</td>
                                            <td><input name={`view[${k}]`} onChange={handleChange} type={`checkbox`} defaultChecked={isChecked('view')} defaultValue={`1`} className={`btn`} /></td>
                                            <td><input name={`add[${k}]`} onChange={handleChange} type={`checkbox`} defaultChecked={isChecked('add')} defaultValue={`1`} className={`btn`} /></td>
                                            <td><input name={`edit[${k}]`} onChange={handleChange} type={`checkbox`} defaultChecked={isChecked('edit')} defaultValue={`1`} className={`btn`} /></td>
                                            <td><input name={`delete[${k}]`} onChange={handleChange} type={`checkbox`} defaultChecked={isChecked('delete')} defaultValue={`1`} className={`btn`} /></td>
                                            <th><input name={`menu[${k}]`} onChange={handleChange} type={`hidden`} defaultValue={value?.id} className={``} /></th>
                                        </tr>)
                                    })) : (<tr>
                                        <th colSpan={columnCount} >No data available...</th>
                                    </tr>)}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan={columnCount} >
                                        <div className="col-12">
                                            {response && (
                                                <SubmitButton className={`custom`} name={loading ? 'Submitting...' : 'Submit Form'} />
                                            )}
                                        </div>
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </form>
                </div>
            </div>
        </>
    );
}

export default PermissionTable;