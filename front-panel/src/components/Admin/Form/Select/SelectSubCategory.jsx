import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { customStyles, ucwords } from '../../../../utils/helper'
import { get } from '../../../../utils/AxiosUtils';

function SelectSubCategory({ id, handleChange, value, error, label = null, required = false, disabled = false, multiple = false }) {
    const [response, setResponse] = useState();

    let subCategoryOptions = response?.data?.map((item) => ({
        value: item?.id,
        label: `${ucwords(item?.name)}`
    }));

    const fetchData = async () => {
        const res = await get('/sub-categories?page=0');
        setResponse(res?.response);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleSelectChange = (selectedOptions) => {
        const selectedValues = multiple ? (selectedOptions ? selectedOptions.map(option => option.value) : []) : [];
        handleChange({ target: { name: id, value: (multiple ? selectedValues : selectedOptions.value) } });
    };

    const selectedValueOptions = subCategoryOptions?.filter(option => value?.includes(option?.value));

    return (
        <>
            {label ? (
                <label htmlFor={id} className={`form-label text-capitalize`}>{(label)} {required ? (<span className='text-danger'>*</span>) : ('')}</label>
            ) : ('')}
            <Select
                className={error ? 'is-invalid' : ''}
                id={id}
                value={multiple ? selectedValueOptions : (selectedValueOptions?.find(option => option.value === value))}
                options={subCategoryOptions}
                placeholder={`Select Sub Categories`}
                onChange={handleSelectChange}
                styles={customStyles}
                isMulti={multiple}
                isDisabled={disabled}
            />
            {error && <div className={`invalid-feedback`}>{error}</div>}
        </>
    )
}

export default SelectSubCategory;
