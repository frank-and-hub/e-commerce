import React from 'react'
import { rasc } from '../../../utils/helper'

export default function Input({ name, label, value, error, onChange, type = `text`, onBlur = (e) => e.preventDefault(), readonly = false, required = false, disabled = false, inputType = false }) {
    const InputItem = (<input
        name={name}
        type={type}
        onBlur={onBlur}
        id={rasc(name)}
        onChange={onChange}
        disabled={disabled}
        readOnly={readonly}
        defaultValue={value}
        autoComplete={`off`}
        placeholder={`Enter ${(name).replace('_', ' ')}`}
        className={`${type === `checkbox` ? `form-check-input`:`form-control`}${inputType ? `` : ` rounded-pill`}${error ? ` is-invalid` : ``}`}
    />);

    return (
        <>
            <div className={`${inputType ? `col-md-4` : `row mb-3`}`} >
                <>
                    {label && (<label htmlFor={rasc(name)} className={`text-capitalize${inputType ? ` form-label` : `col-md-4 col-lg-3 col-form-label text-start`}`}>{(label)} {required && <span className={`text-danger`}>*</span>}</label>)}
                    <>
                        {inputType ? InputItem : <div className={`col-md-8 col-lg-9`}>{InputItem}</div>}
                    </>
                    {error ? (
                        <div className={`invalid-feedback`} >{error}</div>
                    ) : (
                        <div className={`valid-feedback`} >{`${name} is correct`}</div>
                    )}
                </>
            </div>
        </>
    )
};