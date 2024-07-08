import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

function LoginPage({ onUsernameSubmit, onAdminLogin }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const [errorMessage,setErrorMessage] = useState('');

    console.log('LoginPage props:', { onUsernameSubmit, onAdminLogin });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSuccessfulLogin = (token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', formData.name);
        console.log('Sacuvao sam ti token');
    };

    const validate = (email, password) => {
        if(email == '' || password == '') {
            return 1;           
        }
        return 0;
    }

    const handleClick = async () => {
        if(validate(formData.email,formData.password)) {
            setErrorMessage('Morate uneti i email i password.');
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            console.log('Response:', response);
            console.log('typeofresponse', typeof(response))

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Invalid response format' }));
                console.error('Logovanje nije uspelo:', errorData);
                return;
            }

            const data = await response.json().catch(() => ({ message: 'Invalid response format' }));
            console.log('DATA', data);
            console.log('onUsernameSubmit type:', typeof onUsernameSubmit); // Dodato za logovanje
            if (typeof onUsernameSubmit === 'function') {
                console.log('Calling onUsernameSubmit with:', data.user.name); // Dodato za logovanje
                onUsernameSubmit(data.user.name);
            } else {
                console.error('onUsernameSubmit is not a function');
            }
            handleSuccessfulLogin(data.access_token);
            console.log('Logovanje uspešno:', data);

            if (data.user.role === 'admin') {
                if (typeof onAdminLogin === 'function') {
                    onAdminLogin(data.access_token);
                }
                navigate('/admin/startgame');
            } else {
                navigate('/startgame');
            }

        } catch (error) {
            console.error('Greška pri logovanju:', error);
            setErrorMessage('Korisnik nije pronadjen.');
        }
    };

    const handleClick3 = () => {
        navigate('/forgotpassword');
    }

    return (
        <>
            <div className="joinGameContainer">
                <h2 className="usernameLabel">Login details:</h2>
                <br />
                <input type="email" name="email" className="textField loginTextField" value={formData.email} onChange={handleChange} placeholder="Email" />
                <br />
                <input type="password" name="password" className="textField loginTextField" value={formData.password} onChange={handleChange} placeholder="Password" />
                <br />
                <Button onClick={handleClick} title={'Login'} />
                <Button onClick={handleClick3} title={'Forgot password'} />
                {errorMessage && <div className="error">{errorMessage}</div>}
            </div>
        </>
    );
}

export default LoginPage;
