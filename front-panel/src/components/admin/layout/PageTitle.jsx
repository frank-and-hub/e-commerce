import React from 'react'
import { Link } from 'react-router-dom'

function PageTitle({ title, location }) {

    const pathSegments = location.pathname.replace('/admin','').split('/').filter((x) => x);

    return (
        <>
            <div className={`pagetitle text-left mt-3`}>
                <nav className={`d-flex justify-content-between`} >
                    <button type={`button`} className={`shadow btn btn-sm rounded-circle`} >
                        <i className={`ri-arrow-go-forward-fill`} ></i>
                    </button>
                    <ol className={`breadcrumb mb-0 text-capitalize`}>
                        <li className={`breadcrumb-item`}>
                            <Link to={`/admin/index`} >
                            <i className={`bi bi-house-door`}></i></Link>
                        </li>
                        {pathSegments.map((segment, index) => {
                            const routeTo = `/admin/${pathSegments.slice(0, index + 1).join('/')}`;
                            const isLast = index === pathSegments.length - 1;

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
