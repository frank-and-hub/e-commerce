import React from 'react'

function SubmitButton({ className, name, type = 'submit', disable = false, onClick = null }) {
    return (
        <>
            <button className={`text-capitalize col-xl-2 col-md-2 col-sm-3 col-5 btn btn-outline-${className} btn-sm rounded-pill`} type={type} disable={disable} onClick={onClick} >
                {name}
            </button>
        </>
    )
}

export default SubmitButton