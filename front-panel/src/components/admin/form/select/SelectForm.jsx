import React from 'react'
import Select from 'react-select'
import { customStyles, ucwords } from '../../../../utils/helper'

function SelectForm({ id, handleChange, value, error, required = false, disabled = false, label = null, Options }) {
    Options = [{
        value: '',
        label: `Select ${ucwords(id.replace('_id', ''))}`
    },
    ...Options
    ]

    const handleSelectChange = (selectedOption) => {
        handleChange({ target: { name: id, value: selectedOption.value } });
    };

    return (
        <>
            {label ? (
                <label htmlFor={id} className={`form-label text-capitalize`}>{(label)} {required ? (<span className='text-danger'>*</span>) : ('')}</label>
            ) : ('')}
            <Select
                className={error ? 'is-invalid' : ''}
                id={id}
                options={Options}
                value={Options?.find((option) => option.value === value)}
                placeholder={`Select ${label}`}
                onChange={handleSelectChange}
                styles={customStyles}
                isDisabled={disabled}
            />
            {error && <div className={`invalid-feedback`}>{error}</div>}
        </>
    )
}

export default SelectForm