import React, { useState } from 'react'
import { useFormValidation } from '../../Admin/Form/FormValidation';
import validate from './validate'
import { post } from '../../../utils/AxiosUtils';
import { notifyError, notifyInfo, notifySuccess } from '../../Admin/Comman/Notification/Notification';


export const ContactUs = ({ data }) => {
    const user = data;

    const [loading, setLoading] = useState(false);
    const [formKey, setFormKey] = useState(0);

    const initialState = {
        name: '',
        userId: user?._id,
        email: '',
        message: '',
    };

    const { formData: values, errors, handleChange, handleSubmit: validateSubmit, setFormData: setValues } = useFormValidation(initialState, validate);

    const handleSubmit = async (e) => {
        e.preventDefault();
        notifyInfo(values);
        validateSubmit(e);
        if (errors && Object.keys(errors).length > 0) {
            console.info(`Form validation failed : `);
            console.table(errors);
            return false;
        }
        setLoading(true)
        try {
            const res = await post('/contacts', values);
            if (res) {
                resetForm()
                notifySuccess(res.message)
            }
        } catch (err) {
            notifyError(`Something went wrong`);
            console.error(err.message);
        } finally {
            setLoading(false)
        }
    };

    const resetForm = () => {
        setValues(initialState);
        setFormKey((prevKey) => prevKey + 1);
        document.getElementsByTagName('form')[0].reset();
    };

    return (
        <>
            <section id="contact" className="contact-area section-big">
                <div className={`container`}>

                    <div className={`row`}>
                        <div className="col-md-12 text-center">
                            <div className="section-title">
                                <h2><span>Contact</span> Me</h2>
                                <p>The new common language will be more simple and regular now.</p>
                            </div>
                        </div>
                    </div>

                    <div className={`row`}>
                        <div className={`col-md-12`}>
                            <div className="contact-form">
                                <form key={formKey} id="ajax-contact" onSubmit={handleSubmit} action="/api/contacts" >
                                    <div className="form-group in_name">
                                        <input type="text" name="name" onChange={handleChange} defaultValue={values.name} className="form-control" id="name" placeholder="Name" required="required" disabled={loading} />
                                        <input type="hidden" name="userId" onChange={handleChange} defaultValue={values.userId} className="form-control" id="userId" placeholder="User Id" required="required" disabled={loading} />
                                    </div>
                                    <div className="form-group in_email">
                                        <input type="email" name="email" onChange={handleChange} defaultValue={values.email} className="form-control" id="email" placeholder="Email" required="required" disabled={loading} />
                                    </div>
                                    <div className="form-group in_message">
                                        <textarea rows="5" name="message" onChange={handleChange} defaultValue={values.message} className="form-control" id="message" placeholder="Message" required="required" disabled={loading}></textarea>
                                    </div>
                                    <div className="actions">
                                        <input type="submit" value={`${loading ? 'Send Message' : 'Sending Message'}`} name="submit" id="submitButton" className="btn" data-toggle={`tooltip`} title="Submit Your Message!" />
                                    </div>
                                </form>
                                <div id="form-messages"></div>
                            </div>
                        </div>

                    </div>

                </div>
            </section>
        </>
    );
};