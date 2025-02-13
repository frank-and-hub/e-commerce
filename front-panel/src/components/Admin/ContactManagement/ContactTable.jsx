import React, { useContext, useEffect, useState } from 'react'
import Table from '../Table/Table'
import { useFormValidation } from '../Form/FormValidation'
import { useLoading } from '../../../context/LoadingContext'
import { StatusOptions } from '../../../utils/selects'
import SelectForm from '../Form/Select/SelectForm'
import SubmitButton from '../Form/SubmitButton'
import { ucwords } from '../../../utils/helper'
import { SidebarContext } from '../../../context/SidebarContext'

function ContactTable() {
    const module = 'contacts';
    const [showFilter, setShowFilter] = useState(true);
    const [showTable, setShowTable] = useState(true);
    const { loading, setLoading } = useLoading();
    const [filter, setFilter] = useState({});
    const [formKey, setFormKey] = useState(0);
    const [userDataOptions, setUserDataOptions] = useState([]);
    const { selectUserData } = useContext(SidebarContext);

    const handelFilter = (e) => {
        setShowFilter(!showFilter);
    }

    const validate = (values) => {
        let errors = {}
        return errors;
    }

    const initialState = {
        status: '',
        user_id: ''
    };

    const { formData: values, errors, handleChange, handleSubmit: validateSubmit, setFormData: setValues } = useFormValidation(initialState, validate);

    const handleSubmit = async (e) => {
        setShowTable(false);
        e.preventDefault();
        setLoading(true)
        validateSubmit(e);
        if (errors && Object.keys(errors).length > 0) {
            console.info(`Form validation failed : `);
            console.table(errors);
            return false;
        }
        try {
            setFilter({ ...values });
            setShowTable(true);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false)
        }
    };

    const resetForm = () => {
        setValues(initialState);
        setShowTable(false);
        setFormKey((prevKey) => prevKey + 1);
        document.getElementsByTagName('form')[0].reset();
    };

    const handlers = {
        url: `/${module}`,
        handelView: true,
        handelEdit: false,
        handelDelete: true,
        handelFilter,
        handelCreate: false,
        moduleName: module,
        filter
    };

    useEffect(() => {
        const fetchData = async () => {
            const Options = selectUserData?.data?.map((val, index) => ({
                value: val?.id,
                label: `${ucwords(val?.name)}`
            }));

            setUserDataOptions(Options || []);
        }
        fetchData();
    }, [selectUserData]);

    return (
        <>
            {showFilter && (<div className='card'>
                <div className='card-title pb-0 mb-0 text-capitalize tshadow'>
                    {(module)} Filter
                </div>
                <div className='card-body'>
                    <form key={formKey} encType={`multipart/form-data`} className="row m-0 g-4 needs-validation" onSubmit={handleSubmit} noValidate>
                        <div className="col-md-4">
                            <SelectForm id={`user_id`} label={`User`} value={values.user_id} handleChange={handleChange} error={errors.user_id} required={false} Options={userDataOptions} />
                        </div>
                        <div className="col-md-4">
                            <SelectForm id="status" label={`Status`} value={values.status} handleChange={handleChange} error={errors.status} required={false} Options={StatusOptions} />
                        </div>
                        <div className={`col-md-12`}>
                            <SubmitButton className={`custom`} name={loading ? 'Loading...' : 'apply filter'} disabled={!showTable} />
                            <SubmitButton className={`secondary`} name={`Reset`} type='button' onClick={resetForm} />
                        </div>
                    </form>
                </div>
            </div>)}
            {showTable && (
                <Table table {...handlers} />
            )}
        </>
    )
}

export default ContactTable