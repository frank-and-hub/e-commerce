import React, { Component } from 'react'
import Carousel from '../../Carousel/Carousel'
import CategoriesofTheMonth from '../../CategoriesofTheMonth/CategoriesofTheMonth'
import FeaturedProduct from '../../FeaturedProduct/FeaturedProduct'

class FrontPage extends Component {
    render() {
        return (
            <>
                <Carousel />
                <CategoriesofTheMonth />
                <FeaturedProduct />
            </>
        );
    }
}

export default FrontPage;