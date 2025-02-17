import React, { useContext, useEffect, useState } from 'react'
import Table from '../Table/Table'
import { useLoading } from '../../../context/LoadingContext'
import { useFormValidation } from '../Form/FormValidation'
import { fetchSelectedOptions } from '../../../utils/helper'
import SelectForm from '../Form/Select/SelectForm'
import SubmitButton from '../Form/SubmitButton'
import { StatusOptions } from '../../../utils/selects'
import { SidebarContext } from '../../../context/SidebarContext'

function ProductTable() {
    const module = 'products';
    const [filter, setFilter] = useState({});
    const [formKey, setFormKey] = useState(0);
    const { loading, setLoading } = useLoading();
    const [showTable, setShowTable] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [tagDataOptions, setTagDataOptions] = useState([]);
    const [brandDataOptions, setBrandDataOptions] = useState([]);
    const [colorDataOptions, setColorDataOptions] = useState([]);
    const [discountataOptions, setDiscounDataOptions] = useState([]);
    const [categoryDataOptions, setCategoryDataOptions] = useState([]);
    const { selectCategoryData, selectBrandData, selectColorData, selectDiscountData, selectTagData } = useContext(SidebarContext);

    const handelFilter = (e) => {
        setShowFilter(!showFilter);
    }

    const validate = (values) => {
        let errors = {}
        return errors;
    }

    const initialState = {
        user_id: '',
        category_id: ``,
        sub_category_id: ``,
        brand_id: ``,
        color_id: ``,
        discount_id: ``,
        tag_id: ``,
        status: ''
    };

    const { formData: values, errors, handleChange, handleSubmit: validateSubmit, setFormData: setValues } = useFormValidation(initialState, validate);

    const handleSubmit = async (e) => {
        setShowTable(false);
        e.preventDefault();
        setLoading(true)
        validateSubmit(e);
        if (errors && Object.keys(errors).length > 0) {
            // console.info(`Form validation failed : `);
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

    useEffect(() => {
        const fetchData = async () => {
            const categoryOptions = fetchSelectedOptions(selectCategoryData?.data);
            const brandOptions = fetchSelectedOptions(selectBrandData?.data);
            const colorOptions = fetchSelectedOptions(selectColorData?.data);
            const discountOptions = fetchSelectedOptions(selectDiscountData?.data);
            const tagOptions = fetchSelectedOptions(selectTagData?.data);
            setCategoryDataOptions(categoryOptions || []);
            setBrandDataOptions(brandOptions || []);
            setColorDataOptions(colorOptions || []);
            setDiscounDataOptions(discountOptions || []);
            setTagDataOptions(tagOptions || []);
        }
        fetchData();
    }, [selectCategoryData, selectBrandData, selectColorData, selectDiscountData, selectTagData]);

    return (
        <>
            {showFilter && (<div className='card'>
                <div className='card-title pb-0 mb-0 text-capitalize tshadow'>
                    {(module)} Filter
                </div>
                <div className='card-body'>
                    <form key={formKey} encType={`multipart/form-data`} className="row m-0 g-4 needs-validation" onSubmit={handleSubmit} noValidate>
                        <div className="col-md-4">
                            <SelectForm id={`brand_id`} label={`brand`} value={values.brand_id} handleChange={handleChange} error={errors.brand_id} required={false} Options={brandDataOptions} />
                        </div>
                        <div className="col-md-4">
                            <SelectForm id={`category_id`} label={`category`} value={values.category_id} handleChange={handleChange} error={errors.category_id} required={false} Options={categoryDataOptions} />
                        </div>
                        <div className="col-md-4">
                            <SelectForm id={`color_id`} label={`color`} value={values.color_id} handleChange={handleChange} error={errors.color_id} required={false} Options={colorDataOptions} />
                        </div>
                        <div className="col-md-4">
                            <SelectForm id={`discount_id`} label={`discount`} value={values.discount_id} handleChange={handleChange} error={errors.discount_id} required={false} Options={discountataOptions} />
                        </div>
                        <div className="col-md-4">
                            <SelectForm id={`tag_id`} label={`tag`} value={values.tag_id} handleChange={handleChange} error={errors.tag_id} required={false} Options={tagDataOptions} />
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

export default ProductTable