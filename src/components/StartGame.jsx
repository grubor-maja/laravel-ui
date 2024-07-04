import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import axios from 'axios';
import AllRooms from './AllRooms';


function StartGame({ username, handleDifficulty,handleRoomName }) {
  const navigate = useNavigate();
  

  const handleClick = (difficulty) => {
    handleDifficulty(difficulty);
    navigate('/questions', { state: { difficulty } });
  };

  const explore = () => {
    navigate('/rooms');
}  
function logout() {
  const token = localStorage.getItem('token'); 
  
  axios.post('http://127.0.0.1:8000/api/logout', null, {
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  }) 
  .then(response => {
    console.log(response.data);
    alert('Uspesno ste se odjavili');
    navigate('/');
  })
  .catch(error => {
    console.error('Error logging out:', error);
    alert('Greska pri logoutu')
  });
}

  return (
    <div className="joinGameContainer">
      <h2 className="usernameLabel">Welcome {username} </h2>
      <br />
      <AllRooms handleRoomName={handleRoomName}></AllRooms>
      <Button onClick={() => logout()} title={'Logout'}></Button>
    </div>
  );
}

export default StartGame;
