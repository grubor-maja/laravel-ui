import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { MdArrowBack } from "react-icons/md";

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch('http://127.0.0.1:8000/api/forgotpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Neuspesno poslat mejl za resetovanje');
            }

            console.log('Uspesno poslat mejl za resetovanje');
            alert('Uspesno poslat mejl za resetovanje')
            navigate('/newpassword');

        } catch (error) {
            console.error('Greska u slanju mejla za resetovanje:', error.message);
            alert('Korisnik sa datim mejlom ne postoji')
        }
    };
    const handleBack = () => {
        navigate(-1);
    }

    return (
        <>
        <div className="forgotPasswordContainer">
        <MdArrowBack onClick={handleBack} className='backButton'></MdArrowBack>
        <div  className="homePageContainer">
            <form onSubmit={handleSubmit} >
            <h2 className="usernameLabel">Email:</h2>
                <br />
                <input className="textField"  style={{ width: '100%' }}
                    type="email"
                    placeholder="Unesite vašu email adresu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
                <br />
                <button className='buttonNext' type="submit">Send</button>
            </form>

        </div>
        </div>
        </>
    );
}

export default ForgotPassword;
