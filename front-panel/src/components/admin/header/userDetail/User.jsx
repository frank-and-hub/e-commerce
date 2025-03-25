import React, { useEffect, useState } from 'react'
import SignOut from '../../signOut/SignOut'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getFullName } from '../../../../utils/helper';

function User() {
    const user = useSelector((state) => (state.auth.user));
    const [src, setSrc] = useState(``);

    const defaultImage = `assets/img/profile-img.jpg`;

    useEffect(() => {
        setSrc(user?.image?.path ?? defaultImage);
    }, [user, src,defaultImage]);

    const handleError = () => {
        setSrc(defaultImage);
    }

    return (
        <>
            <li className={`nav-item dropdown pe-3`}>
                <Link
                    className={`nav-link nav-profile d-flex align-items-center pe-0`}
                    onClick={(e) => e.preventDefault()}
                    data-bs-toggle={`dropdown`}
                >
                    <img src={src} alt="Profile" className={`rounded-circle circle-image-small`} loading={`lazy`} onError={handleError} />
                    <span className={`d-none d-md-block dropdown-toggle ps-2`}>{getFullName(user?.name)}</span>
                </Link>
                <ul className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow profile rounded-25 card-color`}>
                    <li className={`dropdown-header`}>
                        <Link to={`/admin/profile`} className={``} >
                            <h6 className={``} >{getFullName(user?.name)}</h6>
                            <span className={``} >{user?.email}</span>
                        </Link>
                    </li>
                    <li className={`p-1`}>

                    </li>
                    <SignOut />
                </ul>
            </li>
        </>
    )
}

export default User;
