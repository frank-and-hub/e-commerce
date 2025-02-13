import React from 'react'
import { Link } from 'react-router-dom'
import { ucwords } from '../../../utils/helper'

export const Pricing = ({ data }) => {
    const userPlan = data?.plans;

    return (
        <>
            <section key={Math.floor(Math.random())} id="pricing" data-stellar-background-ratio="0.5"  className="pricing-area section-big">
                <div className={`container`}>
                    <div className={`row`}>
                        <div className="col-md-12 col-sm-12">
                            <div className="section-title">
                                <h1>Plans</h1>
                            </div>
                        </div>
                        {userPlan && userPlan.length > 0 && userPlan.map((plan) => (
                            <div className="col-md-6 col-sm-6">
                                <div className="pricing-thumb text-left">
                                    <div className="pricing-title">
                                        <h2>{ucwords(plan?.name)}</h2>
                                    </div>
                                    <div className="pricing-info" >
                                        <p>{plan?.description}</p>
                                    </div>
                                    <div className="pricing-bottom">
                                        <span className="pricing-dollar">{`${plan?.currency} ${plan?.price}/- ${plan?.payment_type}`} </span>
                                        <Link to={`#`} className="section-btn pricing-btn">now</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};
