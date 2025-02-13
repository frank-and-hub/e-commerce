import React from 'react'
import { rasc } from '../../../utils/helper'

function Textarea({ name, label, type = 'text', value, onChange, error, required = false, disabled = false, className = null, editor = false, border = null }) {
    const InputItem = <textarea name={name} type={type} className={`form-control border-${border} ${editor ? 'quill-editor-full' : ''}I ${className ?? ''} ${error ? 'is-invalid' : ''}`} id={rasc(name)} defaultValue={value} style={{ height: `${className ? '100px' : '25px'}` }} onChange={onChange} disabled={disabled} ></textarea>;
    return (
        <>
            <div className={`${className && className === 'w-100' ? 'col-md-12' : 'col-md-4'}`} >
                {label && (<label htmlFor={rasc(name)} className={`text-capitalize form-label`}>{(label)} {required && <span className="text-danger">*</span>}</label>)}
                {InputItem}
                {error && <div className="invalid-feedback">{error}</div>}
            </div>
        </>
    )
}

export default Textarea