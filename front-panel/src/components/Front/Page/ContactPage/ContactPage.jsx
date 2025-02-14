import React, { Component } from 'react'
// import Map from './Map';
import ContactForm from './ContactForm'

class ContactPage extends Component {
    render() {
        return (
            <>
                <div className="container-fluid bg-light py-5">
                    <div className="col-md-6 m-auto text-center">
                        <h1 className="h1">Contact Us</h1>
                        <p>
                            Proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            Lorem ipsum dolor sit amet.
                        </p>
                    </div>
                </div>
                <ContactForm />
                {/* <Map /> */}
            </>
        );
    }
}

export default ContactPage;