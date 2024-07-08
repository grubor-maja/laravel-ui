import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import LoginPage from './LoginPage';

function HomePage({ onUsernameSubmit, onAdminLogin }) {
    const navigate = useNavigate();
    

    const handleRegisterClick = () => {
        navigate('/register');
    }

    const explore = () => {
        navigate('/rooms');
    }

    return (
        <div className="homePageContainer">
            <div className="questionMark">?</div>
            <div className="homepageHero">
                <h2>Welcome to Riddler</h2>
                <p>Log in to your account or start exploring the available quizzes and compete with others right away. Challenge yourself, test your knowledge, and have fun!</p>
            </div>
            <div className="loginForm">
                <LoginPage onUsernameSubmit={onUsernameSubmit} onAdminLogin={onAdminLogin} />
                
                <p>Do not have an account? <button className="registerButton" onClick={handleRegisterClick} title="Register">Register</button></p>
            </div>
            
        </div>
    );
}

export default HomePage;
