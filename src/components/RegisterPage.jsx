import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { MdArrowBack } from "react-icons/md";

function RegisterPage({ onUsernameSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSuccessfulRegistration = (token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', formData.name);
        console.log('Sacuvao sam ti token');
    };

    const handleClick = async () => {
        try {
            if (!formData.name || !formData.email || !formData.password) {
                setErrorMessage('Please enter name, email and password.');
                return;
            }

            if (!formData.email.includes('@')) {
                setErrorMessage('Please enter valid email.');
                return;
            }

            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                onUsernameSubmit(formData.name);
                handleSuccessfulRegistration(data.access_token);
                console.log('Successful registration:', data);
                
                navigate('/startgame');
            } else {
                const errorData = await response.json();
                console.error('Error during registration:', errorData);
                setErrorMessage(errorData.password[0])
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setErrorMessage('Error during registration. Please try again.');
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
        <div className="registerContainer">
            <MdArrowBack onClick={handleBack} className='backButton'></MdArrowBack>
            <div className="joinGameContainer registerForm">
                <div className="loginForm">
                    <h2 className="usernameLabel">Registration details:</h2>
                    <input type="text" name="name" className="textField" value={formData.name} onChange={handleChange} placeholder="Name" />
                    <br />
                    <input type="email" name="email" className="textField" value={formData.email} onChange={handleChange} placeholder="Email" />
                    <br />
                    <input type="password" name="password" className="textField" value={formData.password} onChange={handleChange} placeholder="Password" />
                </div>
                {errorMessage && <div className="error">{errorMessage}</div>}
                <Button onClick={handleClick} title={'Register'}></Button>
            </div>
            </div>
        </>
    );
}

export default RegisterPage;
