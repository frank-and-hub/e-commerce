import React from 'react'
import Select from 'react-select'
import { customStyles, ucwords } from '../../../../utils/helper'
import { useSelector } from 'react-redux';

function SelectRole({ id, handleChange, value, error, required = false, disabled = false, label = null }) {

    const response = useSelector((state) => (state?.role?.role));
    
    let roleOptions = response?.data?.map((item) => ({
        value: item?.id,
        label: `${ucwords(item?.name)}`
    }));

    roleOptions = [{
        value: '',
        label: `Select Role`
    },
    ...roleOptions
    ]

    const handleSelectChange = (selectedOption) => {
        handleChange({ target: { name: id, value: selectedOption.value } });
    };

    return (
        <>
            {label ? (
                <label htmlFor={id} className="form-label text-capitalize">{(label)} {required ? (<span className='text-danger'>*</span>) : ('')}</label>
            ) : ('')}
            <Select
                className={error ? 'is-invalid' : ''}
                id={id}
                options={roleOptions}
                value={roleOptions?.find(option => option.value === value)}
                placeholder="Select an role"
                onChange={handleSelectChange}
                styles={customStyles}
                isDisabled={disabled}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </>
    )
}

export default SelectRole