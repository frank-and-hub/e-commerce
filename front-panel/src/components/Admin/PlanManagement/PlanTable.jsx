import React, { useContext, useEffect, useState } from 'react'
import Table from '../Table/Table'
import SubmitButton from '../Form/SubmitButton'
import { OptionsPaymentMethod, OptionsPaymentType, StatusOptions } from '../../../utils/selects'
import SelectForm from '../Form/Select/SelectForm'
import { useFormValidation } from '../Form/FormValidation'
import { useLoading } from '../../../context/LoadingContext'
import { SidebarContext } from '../../../context/SidebarContext'
import { ucwords } from '../../../utils/helper'


function PlanTable() {
    const module = 'plans';
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
        user: '',
        method: '',
        type: ''
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
                            <SelectForm id="user" label={`user`} value={values.user} handleChange={handleChange} error={errors.user} required={false} Options={userDataOptions} />
                        </div>
                        <div className="col-md-4">
                            <SelectForm id="method" label={`method`} value={values.method} handleChange={handleChange} error={errors.method} required={false} Options={OptionsPaymentMethod} />
                        </div>
                        <div className="col-md-4">
                            <SelectForm id="type" label={`type`} value={values.type} handleChange={handleChange} error={errors.type} required={false} Options={OptionsPaymentType} />
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

export default PlanTable