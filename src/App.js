import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import StartGame from './components/StartGame';
import ResultsPage from './components/ResultsPage';
import './App.css';
import LoginPage from './components/LoginPage';
import AdminStartGame from './components/AdminStartGame';
import CreateQuiz from './components/CreateQuiz';
import AllRooms from './components/AllRooms';
import QuestionsPage2 from './components/QuestionsPage';
import ForgotPassword from './components/ForgotPassword';
import NewPassword from './components/NewPassword';
import OnlineUsers from './components/OnlineUsers';
import EnterCode from './components/EnterCode';

function App() {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState(0);
  const [timeLeftMultiplier, setTimeLeftMultiplier] = useState(10); 
  const [difficultyVariable, setDifficultyVariable] = useState('');
  const [roomName, setRoomName] = useState('');
  const handleResult = (newResult) => {
    setResult(newResult);
  };

  const resetResult = () => {
    setResult(0);
  };
  const handleDifficulty = (newDifficluty) => {
    setDifficultyVariable(newDifficluty);
  };
  const handleRoomName = (newRoomName) => {
    setRoomName(newRoomName);
  };
  const handleUsername = (newUsername) => {
    setUsername(newUsername);
  };
  const [adminToken, setAdminToken] = useState(null);

  const handleAdminLogin = (token) => {
    // Cuvanje tokena u parent komponenti
    setAdminToken(token);
  };

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<HomePage onUsernameSubmit={handleUsername} onAdminLogin={handleAdminLogin} />} />
      <Route path="/login" element={<LoginPage onUsernameSubmit={handleUsername} onAdminLogin={handleAdminLogin} />} />
        <Route path="/register" element={<RegisterPage onUsernameSubmit={handleUsername} />} />
        <Route path="/startgame" element={<StartGame username={username} handleDifficulty={handleDifficulty} handleRoomName={handleRoomName} />} />
        <Route path="/admin/startgame" element={<AdminStartGame username={username} handleDifficulty={handleDifficulty} handleRoomName = {handleRoomName} />} />
        <Route path="/createquiz" element={<CreateQuiz adminToken={adminToken} />} />
        <Route path="/rooms" element={<AllRooms handleRoomName={handleRoomName} />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/newpassword" element={<NewPassword />} />
        <Route path="/onlineusers" element={<OnlineUsers />} />
        <Route path="/entercode" element={<EnterCode roomName={roomName} />} />
        <Route path="/results" element={<ResultsPage username={username} result={result} resetResult={resetResult} />} />
        <Route path="/questions2" element={<QuestionsPage2 handleResult={handleResult} result={result} timeLeftMultiplier={timeLeftMultiplier} difficulty={difficultyVariable} roomName={roomName} username={username} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
