import React from 'react'
import { Link } from 'react-router-dom';

function Logo() {
    const handleToggleSidebar = () => {
        document.body.classList.toggle('toggle-sidebar');
        const element = document.getElementById('sidebar');
        if (element) {
            if (window.innerWidth >= 1020) {
                element.classList.toggle('my-3');
                element.classList.toggle('mx-2');
            } else {
                console.clear();
            }
        }
    }
    return (
        <>
            <div className={`d-flex align-items-center justify-content-between`} >
                <Link
                    className={`logo d-flex align-items-center`}
                    onClick={handleToggleSidebar}
                >
                    <img src={`admin-assets/img/logo.svg`} alt={``} />
                    <span className={`d-none d-md-block`} >Admin</span>
                </Link>
            </div>
        </>
    )
}

export default Logo