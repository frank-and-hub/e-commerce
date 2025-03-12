import React from 'react'
import Card from './Card'

export default function CardForm({ children, handleSubmit, key }) {
    return (
        <>
            <Card >
                <form key={key} encType={`multipart/form-data`} className={`row mt-3 g-3 needs-validation`} onSubmit={handleSubmit} noValidate>
                    {children}
                </form>
            </Card>
        </>
    )
}
