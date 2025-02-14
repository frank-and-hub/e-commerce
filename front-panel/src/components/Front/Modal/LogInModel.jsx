import React, { Component } from 'react'

class LogInModel extends Component {
    render() {
        return (
            <>
                <div className="modal fade bg-white" id="templatemo_login" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="w-100 pt-1 mb-5 text-right position-relative">
                            <button type="button" className="btn-close position-absolute top-0 start-0 btn" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form action={`/`} class={`modal-content modal-body border-0 p-0`} method={`POST`}>
                            <div className="row mb-6">
                                <label className="col-md-12 col-form-label text-md-center">Login</label>
                                <div className="col-md-5">
                                </div>
                            </div>
                            <div className={`mb-3 col-12 row w-100`}>
                                <label htmlFor="email" className="col-md-4 col-form-label text-md-end">Email Address</label>
                                <div className={`col-md-6`} >
                                    <input id="email" type="email" className="form-control " name="email" value={``} required autoComplete="off" autofocus />
                                </div>
                            </div>

                            <div className={`mb-3 col-12 row w-100`}>
                                <label htmlFor="password" className="col-md-4 col-form-label text-md-end">Password</label>

                                <div className={`col-md-6`} >
                                    <input id="password" type="password" className="form-control" name="password" required autoComplete="current-password" />
                                </div>
                            </div>

                            <div className={`mb-3 col-12 row w-100`}>
                                <div className="col-md-6 offset-md-4">
                                    <div className="form-check">
                                        <input className="form-check-input success" type="checkbox" name="remember" id="remember" />
                                        <label className="form-check-label" htmlFor="remember">
                                            Remember Me
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className={`mb-3 col-12 row w-100`}>
                                <div className="col-md-10 offset-md-2">
                                    <button type="submit" className="btn btn-outline-success w-25 mx-1" >
                                        Login
                                    </button>
                                    <button type="button" className="btn btn-outline-success w-25 mx-1" to="#" data-bs-toggle="modal" data-bs-target="#templatemo_register" data-bs-dismiss="modal" aria-label="Close">
                                        Register
                                    </button>
                                </div>
                            </div>
                            <div className={`mb-3 col-12 row w-100`}>
                                <div className="col-md-10 offset-md-2">
                                    <button type="button" className="btn btn-outline-success w-50" to="#" data-bs-toggle="modal" data-bs-target="#templatemo_forget_password" data-bs-dismiss="modal" aria-label="Close">
                                        Forgot Password
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}

export default LogInModel;