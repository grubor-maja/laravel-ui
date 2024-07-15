
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from "react-icons/md";
import Button from './Button';

function EnterCode({ roomName }) {
    const [pin, setPin] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }

    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
        }

        if (pin.length !== 6) {
            setErrorMessage('You must enter six digit code.');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/sobe2/${pin}/quiz`);
            const data = await response.json();

            if (!response.ok) {
                setErrorMessage('Code not valid.');
                return;
            }

            const { soba } = data;
            navigate('/questions2', { state: { room: soba } });
        } catch (error) {
            console.error('Error fetching quiz:', error.message);
            setErrorMessage('Error fetching quiz');
        }
    };

    return (
        <div className='entercodeContainer'>
            <MdArrowBack onClick={handleBack} className='backButton' />
            <div className="enterCodeForm">
                <form onSubmit={handleSubmit} className='entercodeForm'>
                    <label>
                        Unesite PIN kviza:
                        <input 
                            type="text" 
                            value={pin} 
                            onChange={(e) => {
                                setPin(e.target.value);
                                setErrorMessage(''); 
                            }} 
                        />
                    </label>
                    
                    <Button className="buttonNext confirmButton" onClick={handleSubmit} title={'Confirm'}>Potvrdi</Button>
                    
                </form>
                {errorMessage && <div className='error'>{errorMessage}</div>}    
            </div>
        </div>
    );
}

export default EnterCode;