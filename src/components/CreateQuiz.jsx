import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { MdArrowBack } from "react-icons/md";

function CreateQuiz({adminToken}) {
    const navigate = useNavigate ();
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

    const token = localStorage.getItem('token');

    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
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
            navigate('/admin/startgame'); 
        } catch (error) {
            console.error('Error creating quiz:', error);
            
        }
    };
     

    

    function Probica({ adminToken }) {
        console.log('Maja');
        console.log({ adminToken });
    
       
    }

    const { trenutnoPitanje } = formData;
    const trenutnoPitanjeData = formData.pitanja[trenutnoPitanje];

    return (
        <>
        <div className="createQuizBlock">
        <MdArrowBack onClick={handleBack} className='backButton'></MdArrowBack>
        <h1 className='createQuizTitle'>Create your own quiz</h1>
        <form onSubmit={handleSubmit} className='createForm'>
            <div>
            <Probica adminToken={adminToken} />
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
            <Button onClick={handlePrevious} title ={'Previous' } disabled={trenutnoPitanje === 0} className={'previous'}></Button>
            <Button onClick={handleNext} title ={'Next'} disabled={trenutnoPitanje === formData.pitanja.length - 1} className={'next'}></Button>

            </div>

            <br />
            <div className='formGroup'>
            <label>Room code:</label>
            <input type="text" name="kod_sobe" value={formData.kod_sobe} onChange={handleChange2} />
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
            <div className='formGroup'>
            <label>Max number of players:</label>
            <input type="number" name="maksimalan_broj_igraca" value={formData.maksimalan_broj_igraca} onChange={handleChange2} />
            </div>
            <br />
            <div className='formGroup'>
            <label>Room status:</label>
            <select name="status" value={formData.status} onChange={handleChange2}>
                <option value="javna">Public</option>
                <option value="privatna">Private</option>
            </select>
            </div>
            <br />
            <Button onClick={handleSubmit} title ={'Create room'}></Button>
        </form>
        </div>
        </>
    );
}

export default CreateQuiz;
