import React from 'react'

export const Loading = () => {

    return (
        <>
            <div className={`object-fit-contain w-100 h-100`} >
                <img src={`admin-assets/img/loader.gif`} alt={`loading...`} className={`loading position-absolute`} />
            </div>
        </>
    )
}
