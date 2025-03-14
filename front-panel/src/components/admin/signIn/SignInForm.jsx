import React, { useEffect, useTransition } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../utils/AuthContext'
import SubmitButton from '../form/SubmitButton'
import { notifySuccess } from '../comman/notification/Notification'
import { signInValidation, useSingInFormValidation } from '../../../utils/FormValidation'

export const SignInForm = () => {
    const token = useSelector((state) => (state.auth.token));
    const navigate = useNavigate();

    const { login } = useAuth();
    const [isPending, startTransition] = useTransition();

    const initialState = {
        email: '',
        password: ''
    }

    const { values, errors, handleChange, handleSubmit: validateSubmit } = useSingInFormValidation(initialState, signInValidation);

    const handleSubmit = async (e) => {
        e.preventDefault();
        validateSubmit(e);

        if (errors && Object.keys(errors).length !== 0) {
            console.table(errors);
            return false;
        }
        
        startTransition(async () => {
            try {
                const response = await login(values.email, values.password);
                if (!response) throw new Error("Failed to submit form");
                notifySuccess(response.message);
                navigate('/admin/index', { replace: true })
            } catch (error) {
                console.error(`Error during login: ${error}`);
            }
        });
    }

    useEffect(() => {
        navigate(token ? '/admin' : '/admin/signin', { replace: true })
    }, [token, navigate]);

    return (
        <>
            <form encType={`multipart/form-data`} className={`row mt-3 g-3 needs-validation`} onSubmit={handleSubmit} noValidate>
                <div className={`col-12`}>
                    <label htmlFor={`yourUsername`} className={`form-label`}>User Email</label>
                    <div className={`input-group has-validation`}>
                        <span className={`input-group-text`} id={`inputGroupPrepend`}> @ </span>
                        <input
                            type={`email`}
                            name={`email`}
                            className={`form-control`}
                            id="yourUsername"
                            value={values.email}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                        {errors.email && <div className={`invalid-feedback d-block`}>{errors.email}</div>}
                    </div>
                </div>

                <div className={`col-12`}>
                    <label htmlFor={`yourPassword`} className={`form-label`}>password</label>
                    <input
                        type={`password`}
                        name={`password`}
                        className={`form-control`}
                        id="yourPassword"
                        value={values.password}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                    {errors.password && <div className={`invalid-feedback d-block`}>{errors.password}</div>}
                </div>

                <div className={`col-12`}>
                    <SubmitButton className={`custom w-50`} disable={isPending} name={isPending ? 'Login...' : 'Login'} />
                </div>
                <div className={`col-12`}>
                    <p className={`small mb-0`}>Don't have account? <Link to={`/admin/signup`}>Sign Up</Link></p>
                </div>
            </form>
        </>
    )
}
