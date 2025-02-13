import React from 'react'
import { ucwords, lowercase } from '../../../utils/helper'
import { OptionsProjectType } from '../../../utils/selects'


export const Work = ({ data }) => {
    const userProjects = data?.projects;
    
    return (
        <>
            <section id="work" className="works section-big">
                <div className={`container`}>

                    <div className={`row`}>
                        <div className="col-md-12 text-center">
                            <div className="section-title">
                                <h2><span>My</span> Works</h2>
                                <p>The new common language will be more simple and regular than.</p>
                            </div>
                        </div>
                    </div>

                    <div className={`row`}>
                        <ul className={`work filters`}>
                            <li className={`filter`} data-filter="all">
                                <span className="icon-presentation"></span> All
                            </li>
                            {OptionsProjectType?.map((type, index) => (
                                <li key={index} className={`filter`} data-filter={`.${type?.value}`} >
                                    <span className={`${type?.icon ?? 'icon-browser'}`}></span> {ucwords(type?.value)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={`portfolio`}>
                        <div className={`row work-items`}>
                            {userProjects?.length > 0 && userProjects?.map((project, i) => (
                                <div key={i} className={`col-md-4 col-sm-6 mix ${lowercase(project?.type)}`}>
                                    <div className={`item`}>
                                        <a href={`${project?.image?.path ?? '/assets/img/works/1.jpg'}`} className={`work-popup`}>
                                            <img src={`${project?.image?.path ?? '/assets/img/works/1.jpg'}`} alt={ucwords(project?.name)} />
                                            <div className={`overlay`}><span className={`icon-focus`}></span></div>
                                            <div className={`title`}>{ucwords(project?.name)}</div>
                                        </a>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>


                </div>
            </section>
        </>
    );
}