import React, { useEffect, useState, useTransition } from 'react'
import { useFormValidation } from './../Form/FormValidation'
import { patch } from './../../../utils/AxiosUtils'
import validate from './validate'
import SubmitButton from '../Form/SubmitButton'
import Input from '../Form/Input'
import Textarea from '../Form/RoundedTextarea'
import { notifyError, notifySuccess } from '../Comman/Notification/Notification'
import { useAuth } from '../../../utils/AuthContext'

function ProfileForm({ user }) {
    const { loadUser } = useAuth();
    const [isPending, startTransition] = useTransition();
    const [formKey, setFormKey] = useState(0);
    const userId = user?._id;

    const initialState = {
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        gender: user?.gender ?? '',
        about: user?.about ?? '',
        zipcode: user?.zipcode ?? '',
        address: user?.address ?? '',
        city: user?.city ?? '',
        state: user?.state ?? ''
    };

    const { formData: values, errors, handleChange, handleSubmit: validateSubmit, setFormData: setValues } = useFormValidation(initialState, validate);

    const handleSubmit = async (e) => {
        e.preventDefault();

        validateSubmit(e);

        if (errors && Object.keys(errors).length !== 0) {
            console.info(`Form validation failed : `);
            console.table(errors);
            return false;
        }

        const convertedData = Object.entries(values).map(([key, value]) => ({
            propName: key,
            value: value
        }));

        startTransition(async () => {
            try {
                const response = await patch(`/users/${userId}`, convertedData);
                if (!response) throw new Error("Failed to submit form");
                loadUser();
                resetForm()
                notifySuccess(response.message);
            } catch (error) {
                notifyError(`Error during updating user profile data: ${error}`);
            }
        });
    }

    const resetForm = () => {
        setValues(initialState);
        setFormKey((prevKey) => prevKey + 1);
        document.getElementsByTagName('form')[0].reset();
    };

    useEffect(() => {
        if (!user)
            loadUser();
        // } else {
        //   setValues(initialState);
        // }
    }, [user, loadUser]);


    return (
        <>
            <form key={formKey} encType={`multipart/form-data`} onSubmit={handleSubmit}>
                <div className="row mb-3"></div>
                <Input name="name" label="Name" value={values?.name} onChange={handleChange} error={errors.name} required={true} />
                <Input name="phone" label="Phone" value={values?.phone} onChange={handleChange} error={errors.phone} required={true} />
                <Input name="email" label="Email" type="email" value={values?.email} onChange={handleChange} error={errors.email} required={true} />
                <Input name="gender" label="Gender" value={values?.gender} onChange={handleChange} error={errors.gender} required={true} />
                <Textarea name="about" label="About" value={values?.about} onChange={handleChange} error={errors.about} required={true} />
                <Input name="address" label="Address" value={values?.address} onChange={handleChange} error={errors.address} required={true} />
                <Input name="city" label="City" value={values?.city} onChange={handleChange} error={errors.city} required={true} />
                <Input name="state" label="State" value={values?.state} onChange={handleChange} error={errors.state} required={true} />
                <Input name="zipcode" label="Zip Code" value={values?.zipcode} onChange={handleChange} error={errors.zipcode} required={true} />
                <div className="text-center">
                    <SubmitButton className={`custom`} name={isPending ? 'Saving...' : 'Save Changes'} />
                </div>
            </form>
        </>
    )
}

export default ProfileForm