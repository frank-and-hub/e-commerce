import React from 'react'
import { Link } from 'react-router-dom'

export const About = ({ data }) => {
    const user = data;

    const userAbout = user?.about;

    return (
        <>
            <section id="about" className="about-area section-big">
                <div className={`container`}>
                    <div className={`row`}>
                        <div className="col-md-12 text-center">
                            <div className="section-title">
                                <h2><span>About</span> Me</h2>
                                <p>{userAbout?.title}</p>
                            </div>
                        </div>
                    </div>
                    <div className={`row`}>
                        <div className="col-md-6">
                            <div className="me-image">
                                <img className='rounded-25' src={`${user?.image?.path ?? '/assets/img/about/about.jpg'}`} alt={user?.name} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="about-me text-left">
                                <h3><span>A Quick</span> Bio</h3>
                                <p>{userAbout?.bio?.length > 0 && userAbout.bio}</p>
                                <Link className="btn dark smooth_scroll" to={userAbout?.resume ? `${userAbout?.resume?.path}` : '#'} target='_blank' download={`resume.pdf`} >Resume</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};