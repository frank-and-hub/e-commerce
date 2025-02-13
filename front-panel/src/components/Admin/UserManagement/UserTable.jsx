import React, { useState } from 'react'
import Table from '../Table/Table'
import SelectRole from '../Form/Select/SelectRole'
import { useFormValidation } from '../Form/FormValidation'
import SelectForm from '../Form/Select/SelectForm'
import SubmitButton from '../Form/SubmitButton'
import { GenderOptions, StatusOptions } from '../../../utils/selects'
import { useLoading } from '../../../context/LoadingContext'


function UsersTable() {
    const module = 'users';
    const [showFilter, setShowFilter] = useState(true);
    const [showTable, setShowTable] = useState(true);
    const { loading, setLoading } = useLoading();
    const [filter, setFilter] = useState({});
    const [formKey, setFormKey] = useState(0);

    const handelFilter = (e) => {
        setShowFilter(!showFilter);
    }

    const validate = (values) => {
        let errors = {}
        return errors;
    }

    const initialState = {
        role_id: '',
        status: '',
        gender: ''
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
        handelEdit: true,
        handelDelete: true,
        handelFilter,
        handelCreate: true,
        moduleName: module,
        filter
    };

    return (
        <>
            {showFilter && (<div className='card'>
                <div className='card-title pb-0 mb-0 text-capitalize tshadow'>
                    {(module)} Filter
                </div>
                <div className='card-body'>
                    <form key={formKey} encType={`multipart/form-data`} className="row m-0 g-4 needs-validation" onSubmit={handleSubmit} noValidate>
                        <div className="col-md-4">
                            <SelectRole id={`role_id`} label={`Role`} value={values.role_id} handleChange={handleChange} error={errors.role_id} required={false} />
                        </div>
                        <div className="col-md-4">
                            <SelectForm id="gender" label={`Gender`} value={values.gender} handleChange={handleChange} error={errors.gender} required={false} Options={GenderOptions} />
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

export default UsersTable