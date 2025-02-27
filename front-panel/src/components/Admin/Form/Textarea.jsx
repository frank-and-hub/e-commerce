import React from 'react'
import { rasc } from '../../../utils/helper'

export default function Textarea({
    name,
    label,
    value,
    error,
    onChange,
    type = `text`,
    border = null,
    editor = false,
    className = null,
    required = false,
    disabled = false,
}) {
    const InputItem = <textarea
        name={name}
        type={type}
        id={rasc(name)}
        onChange={onChange}
        disabled={disabled}
        defaultValue={value}
        placeholder={`Enter ${name}`}
        style={{ height: `${className ? `100px` : `25px`}` }}
        className={`form-control border-${border}${editor ? ` tinymce-editor` : ``}${className ?? ``}${error ? ` is-invalid` : ``}`}
    ></textarea>;
    return (
        <>
            <div className={`${className && className === `w-100` ? `col-md-12` : `col-md-4`}`} >
                {label && (<label htmlFor={rasc(name)} className={`text-capitalize form-label`}>{(label)} {required && <span className={`text-danger`}>*</span>}</label>)}
                {InputItem}
                {error && <div className={`invalid-feedback`}>{error}</div>}
            </div>
        </>
    )
}