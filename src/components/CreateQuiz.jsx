import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import Button2 from './Button2';
import { MdArrowBack } from "react-icons/md";

function CreateQuiz({ adminToken }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        kod_sobe: '',
        naziv_sobe: '',
        pitanja: Array.from({ length: 10 }, () => ({
            pitanje: '',
            odgovori: ['', '', '', ''],
            tacan_odgovor: 0
        })),
        tezina: 'easy',
        maksimalan_broj_igraca: 10,
        status: 'javna',
        trenutnoPitanje: 0
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleBack = () => {
        navigate(-1);
    }

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const newPitanja = [...formData.pitanja];
        newPitanja[index][name.split('.')[1]] = value; 
        setFormData({ ...formData, pitanja: newPitanja });
    };

    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOdgovorChange = (e, indexPitanja, indexOdgovora) => {
        const { value } = e.target;
        const newPitanja = [...formData.pitanja];
        newPitanja[indexPitanja].odgovori[indexOdgovora] = value;
        setFormData({ ...formData, pitanja: newPitanja });
    };

    const handlePrevious = () => {
        setFormData({ ...formData, trenutnoPitanje: Math.max(formData.trenutnoPitanje - 1, 0) });
    };

    const handleNext = () => {
        setFormData({ ...formData, trenutnoPitanje: Math.min(formData.trenutnoPitanje + 1, formData.pitanja.length - 1) });
    };

    const validateForm = () => {
        // Provera da li su sva polja popunjena
        if (!formData.naziv_sobe || !formData.tezina || !formData.status) {
            setErrorMessage('Sva polja moraju biti popunjena');
            return false;
        }

        // Provera pitanja i odgovora
        for (let pitanje of formData.pitanja) {
            if (!pitanje.pitanje || pitanje.odgovori.some(odgovor => !odgovor)) {
                setErrorMessage('Sva polja za pitanja i odgovore moraju biti popunjena');
                return false;
            }
        }

        // Provera formata kod_sobe za privatne sobe
        if (formData.status === 'privatna') {
            const kodSobeRegex = /^[a-zA-Z0-9]{6}$/;
            if (!kodSobeRegex.test(formData.kod_sobe)) {
                setErrorMessage('Kod za sobu mora da sadrzi 6 karaktera');
                return false;
            }
        }

        setErrorMessage(''); // Resetovanje poruke greske ako nema greski
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/sobe', 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log(response.data);
            window.alert('Kviz uspesno kreiran'); 
            navigate('/admin/startgame'); 
        } catch (error) {
            console.error('Greska u kreiranju kviza:', error);
        }
    };

    const { trenutnoPitanje } = formData;
    const trenutnoPitanjeData = formData.pitanja[trenutnoPitanje];

    return (
        <>
            <div className="createQuizBlock">
                <MdArrowBack onClick={handleBack} className='backButton'></MdArrowBack>
                <h1 className='createQuizTitle'>Create your own quiz</h1>
                <form onSubmit={handleSubmit} className='createForm'>
                    <div>
                        <div className="formGroup">
                            <label>{`Question ${trenutnoPitanje + 1}:`}</label>
                            <input 
                                type="text" 
                                name={`pitanja[${trenutnoPitanje}].pitanje`} 
                                value={trenutnoPitanjeData.pitanje} 
                                onChange={(e) => handleChange(e, trenutnoPitanje)} 
                            />
                        </div>

                        <br />
                        {trenutnoPitanjeData.odgovori.map((odgovor, indexOdgovora) => (
                            <div className='formGroup' key={indexOdgovora}>
                                <label>{`Answer ${indexOdgovora + 1}:`}</label>
                                <input type="text" value={odgovor} onChange={(e) => handleOdgovorChange(e, trenutnoPitanje, indexOdgovora)} />
                                <br />
                            </div>
                        ))}
                        <div className="formGroup">
                            <label>Correct answer:</label>
                            <select name={`pitanja[${trenutnoPitanje}].tacan_odgovor`} value={trenutnoPitanjeData.tacan_odgovor} onChange={(e) => handleChange(e, trenutnoPitanje)}>
                                {[0, 1, 2, 3].map((indexOdgovora) => (
                                    <option key={indexOdgovora} value={indexOdgovora}>{`Answer ${indexOdgovora + 1}`}</option>
                                ))}
                            </select>
                        </div>
                        <br />
                    </div>
                    <div className="buttons">
                        <Button2 onClick={handlePrevious} title={'Previous'} disabled={trenutnoPitanje === 0} className={'previous'}></Button2>
                        <Button2 onClick={handleNext} title={'Next'} disabled={trenutnoPitanje === formData.pitanja.length - 1} className={'next'}></Button2>
                    </div>

                    <br />
                    <div className='formGroup'>
                        <label>Room name:</label>
                        <input type="text" name="naziv_sobe" value={formData.naziv_sobe} onChange={handleChange2} />
                    </div>
                    <br />
                    <div className='formGroup'>
                        <label>Quiz difficulty:</label>
                        <select name="tezina" value={formData.tezina} onChange={handleChange2}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    <br />
                    <br />
                    <div className='formGroup'>
                        <label>Room status:</label>
                        <select name="status" value={formData.status} onChange={handleChange2}>
                            <option value="javna">Public</option>
                            <option value="privatna">Private</option>
                        </select>
                    </div>
                    <br />
                    {formData.status === 'privatna' && (
                        <div className='formGroup'>
                            <label>Room code:</label>
                            <input type="text" name="kod_sobe" value={formData.kod_sobe} onChange={handleChange2} />
                        </div>
                    )}
                    <br />
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <Button2 type="submit" title={'Kreiraj kviz'}></Button2>
                </form>
            </div>
        </>
    );
}

export default CreateQuiz;
