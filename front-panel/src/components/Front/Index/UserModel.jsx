import React, { useEffect, useState } from 'react'
// import { Modal, Button } from 'react-bootstrap'
import { useFormValidation } from '../../Admin/Form/FormValidation'
import SelectForm from '../../Admin/Form/Select/SelectForm'
import { ucwords } from '../../../utils/helper'
import { get } from '../../../utils/AxiosUtils'
import { Modal } from 'react-bootstrap'
import SubmitButton from '../../Admin/Form/SubmitButton'
import { useNavigate } from 'react-router-dom'

export const UserModel = ({ setNumber }) => {
    const [modalShow, setModalShow] = useState(true);
    const [userOptions, setUserOptions] = useState([]);
    const navigate = useNavigate();

    const initialState = {
        number: ''
    };

    const validate = (values) => {
        let errors = {}
        if (!values.number) errors.number = 'Please select user';
        return errors;
    }

    const { formData: values, errors, handleChange, handleSubmit: validateSubmit, setFormData: setValues } = useFormValidation(initialState, validate);

    const handleSubmit = async (e) => {
        e.preventDefault();
        validateSubmit(e);
        if (errors && Object.keys(errors).length > 0) {
            console.info(`Form validation failed : `);
            console.table(errors);
            return false;
        }
        console.log(values.number);
        setNumber(values.number);
        setValues(initialState);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reqUserData] = await Promise.all([
                    get(`/users?page=0`)
                ]);
                const Options = reqUserData?.response?.data?.map((val, index) => ({
                    value: val?.phone,
                    label: `${ucwords(val?.name)}`
                }));
                setUserOptions(Options || []);
            } catch (err) {
                console.error(err.message);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Modal show={modalShow} onHide={() => { setModalShow(modalShow); navigate('/admin/signin', { replace: true }) }} size={`dialog-centered`}>
                <Modal.Header className='border-0' closeButton>
                    <Modal.Title className=''>{`Select User`}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center border-0 p-0 w-100'>
                    <form encType={`multipart/form-data`} className="row g-0 w-100 needs-validation" onSubmit={handleSubmit} noValidate>
                        <div className="col-md-12 px-3 pt-2">
                            <SelectForm id={`number`} value={values?.number} handleChange={(e) => { handleChange(e); }} error={errors.number} required={false} disabled={false} label='' Options={userOptions} />
                        </div>
                        <div className="col-md-12 px-3 pt-3">
                            <SubmitButton className={`primary`} name={`Submit`} />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer className='border-0 center'>
                </Modal.Footer>
            </Modal>
        </>
    );
};
