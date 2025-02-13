import React from 'react'
import { ucwords } from '../../../utils/helper'

export const Service = ({ data }) => {
    const userService = data?.services;

    return (
        <>
            <section id="service" className="service-area section-big">
                <div className={`container`}>
                    <div className={`row`}>
                        <div className="col-md-12 text-center">
                            <div className="section-title">
                                <h2><span>What I</span> Do</h2>
                                <p>The new common language will be more simple and regular than.</p>
                            </div>
                        </div>
                    </div>
                    <div className={`row`}>
                        {userService?.length > 0 && userService?.map((service, i) => (
                            <div key={i} className="col-md-6 col-sm-6 col-xs-12">
                                <div className="service-box text-left">
                                    {/* <span className="icon-laptop"></span> */}
                                    <i className={service?.icon}></i>
                                    <h3>{ucwords(service?.name)}</h3>
                                    <p>{service?.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};