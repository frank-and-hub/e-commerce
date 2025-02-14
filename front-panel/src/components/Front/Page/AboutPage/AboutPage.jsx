import React, { Component } from 'react'
import Brands from '../../Brands/Brands'
import OurServices from '../../OurServices/OurServices'
import AboutUs from '../../AboutUs/AboutUs';

class AboutPage extends Component {
    render() {
        return (
            <>
                <AboutUs />
                <OurServices />
                <Brands />
            </>
        );
    }
}

export default AboutPage;