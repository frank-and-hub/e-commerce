import React from 'react'
import { rasc } from '../../../utils/helper'

function Input({ name, label, type = 'text', value, onChange, error, required = false, inputType = false, onBlur, disabled = false, readonly = false }) {

    const InputItem = <input name={name} type={type} className={`form-control ${inputType ? '' : 'rounded-pill'} ${error ? 'is-invalid' : ''}`} id={rasc(name)} defaultValue={value} onChange={onChange} autoComplete={`off`} onBlur={onBlur} disabled={disabled} readOnly={readonly} />;

    return (
        <>
            <div className={`${inputType ? 'col-md-4' : 'row mb-3'}`} >
                {label && (<label htmlFor={rasc(name)} className={`text-capitalize ${inputType ? 'form-label' : 'col-md-4 col-lg-3 col-form-label text-start'}`}>{(label)} {required && <span className="text-danger">*</span>}</label>)}
                {inputType ? InputItem : <div className={`col-md-8 col-lg-9`}>{InputItem}</div>}
                {error && <div className={`invalid-feedback`} >{error}</div>}
            </div>
        </>
    )
}

export default Input