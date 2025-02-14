import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class FooterNavBar extends Component {
    render() {
        return (
            <>
                <div className={`col-md-4 pt-5`}>
                    <h2 className="h2 text-light border-bottom pb-3 border-light">Further Info</h2>
                    <ul className="list-unstyled text-light footer-link-list">
                        <li><Link className={`text-decoration-none`} to={`/index`} >Home</Link></li>
                        <li><Link className={`text-decoration-none`} to={`/about`} >About Us</Link></li>
                        <li><Link className={`text-decoration-none`} to={`/shop`} >Shop Locations</Link></li>
                        <li><Link className={`text-decoration-none`} to={`/contact`} >Contact</Link></li>
                    </ul>
                </div>
            </>
        );
    }
}

export default FooterNavBar;