import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { MdArrowBack } from "react-icons/md";

function NewPassword() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [new_password, setPassword] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async () => {
        // Reset error message
        setErrorMessage('');

        // Validation checks
        if (!email || !code || !new_password) {
            setErrorMessage('Popunite sva polja.');
            return;
        }

        if (new_password.length < 8) {
            setErrorMessage('Unesite lozinku koja sadrži najmanje 8 karaktera.');
            return;
        }

        const hasLetter = /[a-zA-Z]/.test(new_password);
        if (!hasLetter) {
            setErrorMessage('Lozinka mora sadržati barem jedno slovo.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Unesite validnu email adresu.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/resetpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, code, new_password })
            });
            if (!response.ok) {
                throw new Error('Failed to reset password');
            }

            alert('Uspesno resetovanje lozinke.');
            navigate('/');
        } catch (error) {
            console.error('Error resetting password:', error.message);
            alert('Neispravan mejl ili kod za resetovanje.');
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            <div className="newPasswordBlock">
                <MdArrowBack onClick={handleBack} className='backButton'></MdArrowBack>

                <div className="newPasswordContainer">
                    <h1>New Password</h1>
                    <div className='newPasswordForm'>
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                placeholder="Code"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                value={new_password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="New password"
                            />
                            
                        </div>
                        {errorMessage && <div className="error">{errorMessage}</div>}
                        <Button onClick={handleSubmit} title={'Reset'}></Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NewPassword;
