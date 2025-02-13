import React, { useState } from 'react'
import { post } from './../../../utils/AxiosUtils'
import SubmitButton from '../Form/SubmitButton'
import Input from '../Form/Input';
import { notifyError, notifySuccess } from '../Comman/Notification/Notification';

function ProfileChangePassword({ user }) {

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [renewPassword, setReNewPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [formKey, setFormKey] = useState(0);
    const [error, setError] = useState({});
    const [formValid, setFormValid] = useState(false);

    const handleHoverOff = async () => {
        const id = user._id;
        const result = await post('/users/verify/password', { password: password, id: id });
        setIsPasswordValid(result.data);
    }

    const validateForm = () => {
        let errors = {};
        let valid = true;

        // Current password validation 
        if (!isPasswordValid) {
            errors.password = 'Current password is incorrect';
            valid = false;
        }

        // New password validation (length, strength, etc.)
        if (newPassword.length < 8) {
            errors.newPassword = 'New password must be at least 8 characters long';
            valid = false;
        }

        if (!renewPassword) {
            errors.renewpassword = 'Please re-enter new pasword ';
        }

        // Re-entered password validation
        if (newPassword !== renewPassword) {
            errors.renewPassword = 'New password and re-entered password do not match';
            valid = false;
        }

        setError(errors);

        setFormValid(valid);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from refreshing the page

        if (validateForm()) {
            // Proceed with password change logic here, such as an API call
            const id = user._id;
            try {
                const result = await post('/users/change/password', {
                    oldPassword: password,
                    newPassword: newPassword,
                    id: id
                });

                if (result.data) {
                    notifySuccess(`Password changed successfully`);
                }
                resetForm()
            } catch (error) {
                notifyError(`'Error changing password: ${error}`);
            }
        }
    };

    const resetForm = () => {
        setFormKey((prevKey) => prevKey + 1);
        document.getElementsByTagName('form')[0].reset();
    };

    return (
        <>
            <form key={formKey} encType={`multipart/form-data`} onSubmit={handleSubmit}>
                <div className="row mb-3"></div>
                <Input name="password" type="password" label="Current Password" value={password} onChange={(e) => setPassword(e.target.value)} error={error.password} required={true} onBlur={handleHoverOff} inputType={false} />
                <Input name="newpassword" type="password" label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} error={error.newPassword} required={true} onBlur={handleHoverOff} inputType={false} />
                <Input name="renewpassword" type="password" label="Re-enter Password" value={renewPassword} onChange={(e) => setReNewPassword(e.target.value)} error={error.renewPassword} required={true} onBlur={handleHoverOff} inputType={false} />

                <div className="text-center">
                    <SubmitButton className={`custom`} name={formValid ? `Changing...` : `Change Password`} />
                </div>
            </form>
        </>
    )
}

export default ProfileChangePassword;
