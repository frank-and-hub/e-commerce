import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ucwords } from '../../../utils/helper'

export const Navigation = ({ data }) => {
    const user = data;
    const [active, setActive] = useState(null);
    const [show, setShow] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    const togeleNavBar = () => {
        setShow(!show);
    }

    const navBarData = useMemo(() => ({
        'slider': 'home',
        'about': 'about',
        'service': 'service',
        'work': 'work',
        'testimonial': 'testimonial',
        // 'pricing': 'pricing',
        'contact': 'contact',
    }), []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
            Object.entries(navBarData).map(([key, section], index) => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top === 0 && rect.bottom === 0) {
                        setActive(section);
                    }
                }
                return true;
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [navBarData]);

    return (
        <>
            <div className={`menu-area navbar-fixed-top ${isSticky ? 'sticky-menu' : ''}`}>
                <div className={`container`}>
                    <div className={`row`}>
                        <div className={`col-md-12`}>
                            <div className={`mainmenu`}>
                                <div className={`navbar navbar-nobg`}>
                                    <div className={`navbar-header`}>
                                        <Link className={`navbar-brand`} to={`#`}>
                                            <span>{user?.name} - profile</span>
                                        </Link>
                                        <button type={`button`} onClick={togeleNavBar} className={`navbar-toggle`} data-toggle="collapse" data-target=".navbar-collapse">
                                            <span className={`sr-only`} >Toggle navigation</span>
                                            <span className={`icon-bar`}></span>
                                            <span className={`icon-bar`}></span>
                                            <span className={`icon-bar`}></span>
                                        </button>
                                    </div>

                                    <div className={`navbar-collapse collapse ${show ? 'in' : 'collapsing'}`} aria-expanded={!show} style={{ height: `${show ? '253.25px' : '1.25px'}` }} >
                                        <nav >
                                            <ul className={`nav navbar-nav navbar-right`} >
                                                {Object.entries(navBarData).map(([key, value], index) => {
                                                    return (
                                                        <li key={index} className={`${active === key ? 'active' : ''}`} >
                                                            <a className={`smooth_scroll`} onClick={(e) => { setActive(key) }} href={`#${key}`}>{ucwords(value)}</a>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </nav >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};