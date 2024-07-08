import React, { Component } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { useEffect } from 'react';
import { MdArrowBack } from "react-icons/md";

function ResultsPage({username, result,resetResult}) {
    
    const navigate = useNavigate();
    if (username == '') username = 'Guest'


    const handleClick = () => {
        resetResult();       
        navigate('/rooms');
    }    
    const user = localStorage.getItem('user');
    const roomname = localStorage.getItem('naziv_sobe');
    const handleBack = () => {
      navigate('/startgame');
  }
    
    const handleSaveResult = async () => {
        try {
            console.log(user);
            console.log(roomname);
            console.log(result);
          const response = await fetch('http://127.0.0.1:8000/api/rezultati', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              naziv_sobe: roomname,
              ime_igraca: user,
              trenutni_rezultat: result,
            }),
          });
    
          if (response.ok) {
            console.log('Successful result.');
          } else {
            console.error('Error fetching result.');

          }
        } catch (error) {
          console.error('Error sending result:', error);
    
        }
      };
    return ( 
        <>
        <div className="resultsContainer">

        
        <MdArrowBack onClick={handleBack} className='backButton'></MdArrowBack>
        <div className = "joinGameContainer">
            <h2  className = "usernameLabel">{username}, your score is {result} </h2><br />


        </div>
        </div>
        </>

     );
}

export default ResultsPage;