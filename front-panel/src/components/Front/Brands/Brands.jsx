import React from 'react'
import { Link } from 'react-router-dom'

function Brands() {
    return (
        <>
            <section className={`bg-light py-5`}>
                <div className={`container my-4`}>
                    <div className={`row text-center py-3`}>
                        <div className={`col-lg-6 m-auto`}>
                            <h1 className={`h1`}>Our Brands</h1>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                Lorem ipsum dolor sit amet.
                            </p>
                        </div>
                        <div className={`col-lg-9 m-auto tempaltemo-carousel`}>
                            <div className={`row d-flex flex-row`}>
                                <div className={`col-1 align-self-center`}>
                                    <Link className={`h1`} to={`#templatemo-slide-brand" role="button" data-bs-slide="prev`}>
                                        <i className={`text-light fas fa-chevron-left`}></i>
                                    </Link>
                                </div>
                                <div className={`col`}>
                                    <div className={`carousel slide carousel-multi-item pt-2 pt-md-0" id="templatemo-slide-brand" data-bs-ride="carousel`}>
                                        <div className={`carousel-inner product-links-wap`} role={`listbox`}>

                                            <div className={`carousel-item active`}>
                                                <div className={`row`}>
                                                    <div className={`col-3 p-md-5`}>
                                                        <Link to={`#`}><img className={`img-fluid brand-img`} src="assets/img/brand_01.png" alt="Brand Logo" /></Link>
                                                    </div>
                                                    <div className={`col-3 p-md-5`}>
                                                        <Link to={`#`}><img className={`img-fluid brand-img`} src="assets/img/brand_02.png" alt="Brand Logo" /></Link>
                                                    </div>
                                                    <div className={`col-3 p-md-5`}>
                                                        <Link to={`#`}><img className={`img-fluid brand-img`} src="assets/img/brand_03.png" alt="Brand Logo" /></Link>
                                                    </div>
                                                    <div className={`col-3 p-md-5`}>
                                                        <Link to={`#`}><img className={`img-fluid brand-img`} src="assets/img/brand_04.png" alt="Brand Logo" /></Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`carousel-item`}>
                                                <div className={`row`}>
                                                    <div className={`col-3 p-md-5`}>
                                                        <Link to={`#`}><img className={`img-fluid brand-img`} src="assets/img/brand_01.png" alt="Brand Logo" /></Link>
                                                    </div>
                                                    <div className={`col-3 p-md-5`}>
                                                        <Link to={`#`}><img className={`img-fluid brand-img`} src="assets/img/brand_02.png" alt="Brand Logo" /></Link>
                                                    </div>
                                                    <div className={`col-3 p-md-5`}>
                                                        <Link to={`#`}><img className={`img-fluid brand-img`} src="assets/img/brand_03.png" alt="Brand Logo" /></Link>
                                                    </div>
                                                    <div className={`col-3 p-md-5`}>
                                                        <Link to={`#`}><img className={`img-fluid brand-img`} src="assets/img/brand_04.png" alt="Brand Logo" /></Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`carousel-item`}>
                                                <div className={`row`}>
                                                    <div className={`col-3 p-md-5`}>
                                                        <Link to={`#`}><img className={`img-fluid brand-img`} src="assets/img/brand_01.png" alt="Brand Logo" /></Link>
                                                    </div>
                                                    <div className={`col-3 p-md-5`}>
                                                        <Link to={`#`}><img className={`img-fluid brand-img`} src="assets/img/brand_02.png" alt="Brand Logo" /></Link>
                                                    </div>
                                                    <div className={`col-3 p-md-5`}>
                                                        <Link to={`#`}><img className={`img-fluid brand-img`} src="assets/img/brand_03.png" alt="Brand Logo" /></Link>
                                                    </div>
                                                    <div className={`col-3 p-md-5`}>
                                                        <Link to={`#`}><img className={`img-fluid brand-img`} src="assets/img/brand_04.png" alt="Brand Logo" /></Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`col-1 align-self-center`}>
                                    <Link className={`h1`} to={`#templatemo-slide-brand" role="button" data-bs-slide="next`}>
                                        <i className={`text-light fas fa-chevron-right`}></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Brands