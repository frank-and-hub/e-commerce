import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class HeaderNavBar extends Component {
    render() {
        return (
            <>
                <div className="flex-fill">
                    <ul className="nav navbar-nav d-flex justify-content-between mx-lg-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to={`index`} >Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={`about`} >About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={`shop`} >Shop</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={`contact`} >Contact</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={`#`}  data-bs-toggle="modal" data-bs-target="#templatemo_login" >Login</Link>
                        </li>
                    </ul>
                </div>
            </>
        );
    }
}

export default HeaderNavBar;