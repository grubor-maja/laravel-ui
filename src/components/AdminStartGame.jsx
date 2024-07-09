import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import axios from 'axios';
import AllRooms from './AllRooms';


function AdminStartGame({ username, handleDifficulty,handleRoomName }) {
  const navigate = useNavigate();
  

  const handleClick = (difficulty) => {
    handleDifficulty(difficulty);
    navigate('/questions', { state: { difficulty } });
  };
  const handleClick2 = () => {
    navigate('/createquiz');
  }
  const explore = () => {
    navigate('/rooms', { state: { username } });
  };
  function logout() {
    const token = localStorage.getItem('token'); 
    
    axios.post('http://127.0.0.1:8000/api/logout', null, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    }) 
    .then(response => {
      console.log(response.data);
      alert('Successful logout');
      navigate('/');
    })
    .catch(error => {
      alert('Error logging out');
      console.error('Error logging out:', error);
    });
  }
  
  return (
    <div className="joinGameContainer">
      <h2 className="usernameLabel">Welcome Admin: {username}</h2>
      <br />
      <AllRooms handleRoomName={handleRoomName}></AllRooms>
      <Button onClick={() => handleClick2()} title={'Create quiz'}></Button>
      <Button onClick={() => logout()} title={'Logout'}></Button>

    </div>
  );
}

export default AdminStartGame;
