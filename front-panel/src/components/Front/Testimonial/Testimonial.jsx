import React from 'react'
import { ucwords } from '../../../utils/helper'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export const Testimonial = ({ data }) => {
    const userTestimonial = data?.testimonials;

    const settings = {
        lazyLoad: true,
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 980,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 479,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <>
            <section id="testimonial" className="testimonial-area section-big">
                <div className={`container`}>

                    <div className="row">
                        <div className="col-md-12 text-center">
                            <div className="section-title">
                                <h2><span>Happy</span> Clients</h2>
                                <p>The new common language will be more simple and regular than.</p>
                            </div>
                        </div>
                    </div>

                    <div className={`row`}>
                        <Slider {...settings} className={`testimonial-list demo-3 w-100`}>
                            {userTestimonial?.length > 0 && userTestimonial?.map((testimonial, i) => (
                                <blockquote key={i} className={`blockquote single-testimonial text-left`}>
                                    <span className={`icon-quote`}></span>
                                    <p className={`w-100 p-5`}>{testimonial?.description}</p>
                                    <div className={`clearfix`}></div>
                                    <img src="assets/img/testi/1.jpg" alt="" />
                                    <footer className={`blockquote-footer`}>{ucwords(testimonial?.name)}</footer>
                                    <p className={`desg`}>{ucwords(testimonial?.title)}</p>
                                </blockquote>
                            ))}
                        </Slider>
                    </div>
                </div>
            </section>
        </>
    );
};