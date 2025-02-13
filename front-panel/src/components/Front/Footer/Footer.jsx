import React from 'react'
import { Link } from 'react-router-dom'
import { lowercase } from '../../../utils/helper'

export const Footer = ({ data }) => {
    const userFooter = data;

    return (
        <>
            <footer className="footer-area">
                <div className={`container`}>

                    <address className="address">
                        <div className="address-box clearfix">
                            <p>{userFooter?.address}, {userFooter?.city}, {userFooter?.state}, {userFooter?.zipcode}</p>
                        </div>
                        <div className="address-box clearfix">
                            <p><Link to={`tel:${userFooter?.phone}`}>+{userFooter?.phone}</Link></p>
                        </div>
                        <div className="address-box clearfix">
                            <p><Link to={`mailto:${userFooter?.email}`}>{userFooter?.email}</Link></p>
                        </div>
                    </address>

                    <ul className="social-ul">
                        {userFooter?.social_details.length > 0 && userFooter?.social_details.map((details, i) => (
                            <li key={i} >
                                <Link to={`/${details?.url}`}>
                                    <i className={`${lowercase(details?.icon)}`}></i>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <p className="copyright">&copy; {new Date().getFullYear()} Copyright web_bean</p>

                </div>
            </footer>
        </>
    );
};