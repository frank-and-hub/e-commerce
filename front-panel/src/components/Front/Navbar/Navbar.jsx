import React, { Component } from 'react';
import NevBarLinks from './NevBarLinks';

class Navbar extends Component {
    render() {
        return (
            <>
                <nav className="navbar navbar-expand-lg bg-dark navbar-light d-none d-lg-block" id="templatemo_nav_top">
                    <div className="container text-light">
                        <div className="w-100 d-flex justify-content-between">
                            <div>
                                <i className="fa fa-envelope mx-2"></i>
                                <a className="navbar-sm-brand text-light text-decoration-none" href="mailto:info@company.com">info@company.com</a>
                                <i className="fa fa-phone mx-2"></i>
                                <a className="navbar-sm-brand text-light text-decoration-none" href="tel:010-020-0340">010-020-0340</a>
                            </div>
                            <NevBarLinks />
                        </div>
                    </div>
                </nav>
            </>
        );
    }
}

export default Navbar;