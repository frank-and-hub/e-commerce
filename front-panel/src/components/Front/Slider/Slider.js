import React from 'react'
import { Link } from 'react-router-dom'
import { ReactTyped } from 'react-typed'
import { ucwords } from '../../../utils/helper'

export const Slider = ({ data }) => {
    const user_Name = data?.name ?? '';
    const userGender = data?.gender ?? '';
    const userDesignation = data?.designations ?? [];
    const userNewDesignations = userDesignation?.map((designation, i) => {
        return ucwords(designation?.name);
    });

    return (
        <>
            <section id="slider" className="slider-area">
                <div className="table">
                    <div className="table-cell">
                        <div className="intro-text">
                            <div className={`container`}>
                                <div className={`row`}>
                                    <div className={`col-md-12`}>
                                        <h2>{`${userGender === 'male' ? 'Mr.' : 'Mrs.'} ${user_Name}`}</h2>
                                        <div className="typejs">
                                            <ReactTyped
                                                strings={userNewDesignations}
                                                typeSpeed={80}
                                                loop
                                            />
                                        </div>
                                        <div className="clearfix"></div>
                                        <Link to="#about" className="icon-btn smooth_scroll">
                                            <i className="fa fa-angle-double-down"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
