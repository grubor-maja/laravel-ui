import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { MdArrowBack } from "react-icons/md";

function NewPassword() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [new_password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!email || !code || !new_password) {
            alert('Please enter all the fields.');
            return;
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter valid email addres.');
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
            
            alert('Successful resetting.');
            navigate('/');
        } catch (error) {
            console.error('Error resetting password:', error.message);
            alert('Error resetting password.');
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
                <form onSubmit={handleSubmit} className='newPasswordForm'>
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
                    <Button onClick={handleSubmit} title={'Reset'}></Button>
                </form>
            </div>
        </div>
        </>
    );
}

export default NewPassword;
