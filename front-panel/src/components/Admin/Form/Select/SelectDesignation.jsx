import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { customStyles, ucwords } from '../../../../utils/helper'
import { get } from '../../../../utils/AxiosUtils';

function SelectDesignation({ id, handleChange, value, error, label = null, required = false, disabled = false, }) {
    const [response, setResponse] = useState();

    const designationOptions = response?.data?.map((item) => ({
        value: item?.id,
        label: `${ucwords(item?.name)}`
    }));

    const fetchData = async () => {
        const res = await get('/designations?page=0');
        setResponse(res?.response);
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Handle multi-select change and store selected values in an array
    const handleSelectChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        handleChange({ target: { name: id, value: selectedValues } });
    };

    // Map the selected designation values back to their label-value pair options
    const selectedValueOptions = designationOptions?.filter(option => value?.includes(option?.value));

    return (
        <>
            {label ? (
                <label htmlFor={id} className="form-label text-capitalize">{(label)} {required ? (<span className='text-danger'>*</span>) : ('')}</label>
            ) : ('')}
            <Select
                className={error ? 'is-invalid' : ''}
                id={id}
                value={selectedValueOptions}
                options={designationOptions}
                placeholder="Select Designations"
                onChange={handleSelectChange}
                styles={customStyles}
                isMulti
                isDisabled={disabled}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </>
    )
}

export default SelectDesignation;
