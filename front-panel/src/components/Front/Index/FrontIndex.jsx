import React, { useEffect, useState } from 'react';
import { get } from '../../../utils/AxiosUtils'

import { Preloader } from '../Preloader/Preloader'
import { Navigation } from '../Navigation/Navigation'
import { Slider } from '../Slider/Slider'
import { About } from '../About/About'
import { Service } from '../Service/Service'
import { Work } from '../Work/Work'
import { Testimonial } from '../Testimonial/Testimonial'
import { ContactUs } from '../Contact/ContactUs'
import { Footer } from '../Footer/Footer'
import { UserModel } from './UserModel';
// import { Pricing } from '../Pricing/Pricing'


function FrontIndex() {
    const [user, setUser] = useState(null);
    const [number, setNumber] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            try {
                const [userData] = await Promise.all([
                    get(`/user_details/${number}`),
                ]);
                setUser(userData?.data);
                setLoading(false)
            } catch (err) {
                setLoading(true)
                console.error(err);
            }
        };

        if (number) {
            fetchData();
        }
    }, [number]);

    return (
        <>
            {!number ? (
                <UserModel setNumber={setNumber} />
            ) :
                (loading ? (
                    <Preloader />
                ) : (
                    <>
                        <Navigation data={user} ></Navigation>
                        <Slider data={user} ></Slider>
                        <About data={user} ></About>
                        <Service data={user} ></Service>
                        <Work data={user} ></Work>
                        <Testimonial data={user} ></Testimonial>
                        {/* <Pricing data={user} ></Pricing> */}
                        <ContactUs data={user} ></ContactUs>
                        <Footer data={user} ></Footer>
                    </>
                ))}
        </>
    );
};

export default FrontIndex;