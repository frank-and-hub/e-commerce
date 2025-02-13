import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { get } from '../../../utils/AxiosUtils'
import { processNotifications } from '../../../utils/notificationUtils'
import Chat from './Chat'

const Support = () => {

    const dispatch = useDispatch();
    const [supportDetails, setSupportDetails] = useState({});

    useEffect(() => {
        const fetchData = async () => {

            try {
                const [supportData] = await Promise.all([
                    get(`/support-details`),
                ]);

                setSupportDetails(supportData?.response?.data || {});

                processNotifications(200, supportData?.message, dispatch);
            } catch (err) {
                processNotifications(err.status || 500, err.message, dispatch);
            }
        };
        fetchData();
    }, [dispatch]);

    return (
        <>
            <section className={`section`}>
                <div className={`card-head`}>
                    <div className={`card-title`}>
                        <p className='p-0 m-0 btn' > Support </p>
                    </div>
                </div>
                <div className="row gy-4">
                    <div className={`${supportDetails.length > 0 ? `col-xl-6` : `col-0 m-0`}`}>
                        {supportDetails && supportDetails.length > 0 && supportDetails.map((values) => (
                            <div className="card p-4">
                                <div className='row p-0'>
                                    <div className="col-xl-6 col-lg-3 col-sm-6">
                                        <div className="info-box py-2">
                                            <h3><i className="bi bi-telephone mb-1 p-2"></i>Call Us</h3>
                                            <p className='mb-2'>{values?.call ?? ''}</p>
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-3 col-sm-6">
                                        <div className="info-box py-2">
                                            <h3> <i className="bi bi-envelope mb-1 p-2"></i>Email Us</h3>
                                            <p className='mb-2'>{values?.email ?? ''}</p>
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-3 col-sm-6">
                                        <div className="info-box py-2">
                                            <h3> <i className="bi bi-clock mb-1 p-2"></i>Open Hours</h3>
                                            <p className='mb-2'>{`${(values?.week_start ?? '')} - ${(values?.week_end ?? '')} - ${(values?.hours_start ?? '')} - ${(values?.hours_end ?? '')}`}</p>
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-3 col-sm-6">
                                        <div className="info-box py-2">
                                            <h3><i className="bi bi-geo-alt mb-1 p-2"></i>Address</h3>
                                            <p className='mb-2'>{values?.address ?? ''}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={`${supportDetails.length > 0 ? `col-xl-6` : `col-12`}`}>
                        <Chat />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Support