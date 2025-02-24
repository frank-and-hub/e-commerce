import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Category extends Component {
    render() {
        return (
            <>

                <div className={`col-lg-3`}>
                    <h1 className={`h2 pb-4`}>Categories</h1>
                    <ul className={`list-unstyled templatemo-accordion`}>
                        <li className={`pb-3`}>
                            <Link className={`collapsed d-flex justify-content-between h3 text-decoration-none`} to={`#collapseOne`}>Gender
                                <i className={`fa fa-fw fa-chevron-circle-down mt-1`}></i>
                            </Link>
                            <ul id={`collapseOne`} className={`collapse show list-unstyled pl-3`}>
                                <li><Link className={`text-decoration-none`} to={`#`}>Men</Link></li>
                                <li><Link className={`text-decoration-none`} to={`#`}>Women</Link></li>
                            </ul>
                        </li>
                        <li className={`pb-3`}>
                            <Link className={`collapsed d-flex justify-content-between h3 text-decoration-none`} to={`#collapseTwo`}>Sale
                                <i className={`pull-right fa fa-fw fa-chevron-circle-down mt-1`}></i>
                            </Link>
                            <ul id={`collapseTwo`} className={`collapse list-unstyled pl-3`}>
                                <li><Link className={`text-decoration-none`} to={`#`}>Sport</Link></li>
                                <li><Link className={`text-decoration-none`} to={`#`}>Luxury</Link></li>
                            </ul>
                        </li>
                        <li className={`pb-3`}>
                            <Link className={`collapsed d-flex justify-content-between h3 text-decoration-none`} to={`#collapseThree`}>Product
                                <i className={`pull-right fa fa-fw fa-chevron-circle-down mt-1`}></i>
                            </Link>
                            <ul id={`collapseThree`} className={`collapse list-unstyled pl-3`}>
                                <li><Link className={`text-decoration-none`} to={`#`}>Bag</Link></li>
                                <li><Link className={`text-decoration-none`} to={`#`}>Sweather</Link></li>
                                <li><Link className={`text-decoration-none`} to={`#`}>Sunglass</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </>
        );
    }
}

export default Category;