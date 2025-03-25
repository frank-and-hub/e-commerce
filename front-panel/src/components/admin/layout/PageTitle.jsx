import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function PageTitle({ title, location }) {

    const pathSegments = location.pathname.replace('/admin', '').split('/').filter((x) => x);
    const [previousUrl, setPreviousUrl] = useState(null);

    const prevUrlRef = useRef(location?.pathname);

    useEffect(() => {
        setPreviousUrl(prevUrlRef.current);
        prevUrlRef.current = location.pathname;
    }, [location]);

    return (
        <>
            <div className={`pagetitle text-left mt-3 pr-2`}>
                <nav className={`d-flex justify-content-between px-1`} >
                    <Link className={`shadow btn btn-sm rounded-pill mx-0 px-3`} to={previousUrl} >
                        <i className={`ri-arrow-go-forward-fill`} ></i> 
                        {/* Go Back */}
                    </Link>
                    <ol className={`breadcrumb mb-2 text-capitalize shadow rounded-pill px-3`}>
                        <li className={`breadcrumb-item`}>
                            <Link to={`/admin/index`} >
                                <i className={`bi bi-house-door`}></i>
                            </Link>
                        </li>
                        {pathSegments.map((segment, index) => {
                            const routeTo = `/admin/${pathSegments.slice(0, index + 1).join('/')}`;
                            const isLast = (index === pathSegments.length - 1);

                            return isLast ? (
                                <li key={index} className={`breadcrumb-item active" aria-current="page`}>
                                    {(segment.replace(/-/g, ' '))}
                                </li>
                            ) : (
                                <li key={index} className={`breadcrumb-item`}>
                                    <Link to={routeTo} data-discover={true} >{(segment.replace(/-/g, ' '))}</Link>
                                </li>
                            );
                        })}
                    </ol>
                </nav>
            </div>
        </>
    );
}

export default PageTitle;
