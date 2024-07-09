import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import useCountdown from './useCountdown';
import Counter from './Counter';
import { useLocation } from 'react-router-dom';
import { MdArrowBack } from "react-icons/md";
import Pusher from 'pusher-js';

const QuestionsPage2 = ({ handleResult, timeLeftMultiplier, difficulty, roomName, roomCode, username }) => {
  console.log('QuestionsPage2 component rendered'); 

  const [quizData, setQuizData] = useState([]); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
  const [otherUsersQuestion, setOtherUsersQuestion] = useState({});
  const location = useLocation();
  const { room } = location.state;

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selected, setSelected] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const prevOtherUsersQuestion = useRef({});

  const [brojac, setBrojac] = useState(1);
  const [result, setResult] = useState(0); 
  const navigate = useNavigate();

  const handleBack = () => {
    updateInRoomStatus(false); 
    navigate(-1);
  };

  const handleCountdownFinish = useCallback(() => {
    if (!selected) {
      console.log('Vreme je isteklo!');
      setTimeLeft(0);
      pauseCountdown();
      handleNextClick();
    }
  }, [selected]);

  const { time, reset: resetCountdown, pause: pauseCountdown } = useCountdown(10, handleCountdownFinish);

  const updateInRoomStatus = useCallback((inRoom) => {
    if (!username) {
      console.error('Username fali');
      return;
    }

    fetch('http://127.0.0.1:8000/api/updateInRoomStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        room: roomName,
        username: username,
        inRoom: inRoom,
      }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => { throw new Error(error.message); });
        }
        return response.json();
      })
      .then(data => {
        console.log('inRoom status uspesno azuriran:', data);
      })
      .catch(error => {
        console.error('Greska u azuriranju inRoom statusa:', error);
      });
  }, [username, roomName]);

  const handleNextClick = useCallback(() => {
    if (!username) {
      console.error('Fali username');
      return;
    }

    console.log('Emitovanje dogadjaja sa sledecim podacima:', {
      room: roomName,
      username: username,
      questionNumber: brojac + 1
    });

    fetch('http://127.0.0.1:8000/api/emitQuestionProgress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        room: roomName,
        username: username,
        questionNumber: brojac + 1,
      }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => { throw new Error(error.message); });
        }
        return response.json();
      })
      .then(data => {
        console.log('Event emitted successfully:', data);
        setBrojac((prevBrojac) => {
          const nextBrojac = prevBrojac + 1;
          setCurrentQuestionIndex(nextBrojac - 1); 
          setSelectedAnswer(null); 
          setSelected(false); 
          resetCountdown();

          if (nextBrojac > 10) {
            console.log(roomName);
            console.log(username);
            console.log(result);
            updateInRoomStatus(false); 
            localStorage.setItem('user', username);
            localStorage.setItem('result', result);
            localStorage.setItem('naziv_sobe', roomName);
            navigate('/results', { state: { timeLeft } });
          }

          return nextBrojac;
        });
      })
      .catch(error => {
        console.error('Error emitting event:', error);
      });
  }, [username, roomName, brojac, resetCountdown, result, updateInRoomStatus, navigate]);

  const handleAnswerClick = useCallback((answer) => {
    if (!selected) {
      setSelectedAnswer(answer);
      setSelected(true);
  
      console.log('Time left: ' + time);
      let scoreMultiplier = answer === quizData[currentQuestionIndex].correctAnswer ? 10 : 0;
      console.log('Score multiplier: ' + scoreMultiplier);
      pauseCountdown();
  
      const roundResult = time * scoreMultiplier;
      console.log('Broj poena za ovaj odgovor: ' + roundResult);
      setResult(prevResult => {
        const newResult = prevResult + roundResult;
        handleResult(newResult); 
        return newResult;
      });
    } else {
      console.log('Vec ste izabrali odgovor');
      window.alert('Vec ste izabrali odgovor');
    }
  }, [selected, time, quizData, currentQuestionIndex, pauseCountdown, handleResult]);
  
  const fetchQuizData = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/sobe/${roomName}/quiz`);
      const data = await response.json();

      const firstRoom = data.soba;
      const allQuestions = firstRoom.pitanja.map((question, index) => ({
        question: question.tekst_pitanja,
        answers: question.odgovori.map(odgovor => odgovor.tekst_odgovora),
        correctAnswer: question.odgovori.find(odgovor => odgovor.tacan_odgovor === 1).tekst_odgovora
      }));

      setQuizData(allQuestions);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    }
  }, [roomName]);

  const fetchUsersProgress = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/room/${roomName}/progress`);
      const data = await response.json();

      const usersProgress = data.reduce((acc, user) => {
        acc[user.username] = { questionNumber: user.question_number, inRoom: user.in_room };
        return acc;
      }, {});

      setOtherUsersQuestion((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(usersProgress)) {
          console.log('Fetched users progress:', usersProgress);
          return usersProgress;
        }
        return prev;
      });
    } catch (error) {
      console.error('Error fetching users progress:', error);
    }
  }, [roomName]);

  useEffect(() => {
    console.log('Room name:', roomName);
    fetchQuizData();
    resetCountdown();
    setResult(0); 
    updateInRoomStatus(true); 

    const pusher = new Pusher('0bf8e5e615e9d75a485f', {
      cluster: 'eu',
    });

    const channel = pusher.subscribe('quiz-room.' + roomName);

    channel.bind('pusher:subscription_succeeded', () => {
      console.log('Successfully subscribed to Pusher channel:', 'quiz-room.' + roomName);
    });

    channel.bind('QuestionProgressUpdated', (data) => {
      console.log('Received event:', data);
      if (data && data.username && data.questionNumber) {
        setOtherUsersQuestion((prev) => {
          const updatedQuestions = { ...prev, [data.username]: { questionNumber: data.questionNumber, inRoom: true } };
          if (JSON.stringify(prev) !== JSON.stringify(updatedQuestions)) {
            console.log('Updated otherUsersQuestion:', updatedQuestions);
            prevOtherUsersQuestion.current = updatedQuestions; 
            return updatedQuestions;
          }
          return prev;
        });
      } else {
        console.error('Invalid event data:', data);
      }
    });

    return () => {
      console.log('Unsubscribing from Pusher channel:', 'quiz-room.' + roomName);
      pusher.unsubscribe('quiz-room.' + roomName);
      updateInRoomStatus(false); 
    };
  }, [roomName, resetCountdown, fetchQuizData, updateInRoomStatus, handleResult]);

  
  useEffect(() => {
    const interval = setInterval(fetchUsersProgress, 10000); 
    return () => clearInterval(interval);
  }, [fetchUsersProgress]);

  useEffect(() => {
    console.log('otherUsersQuestion updated:', otherUsersQuestion);
    if (JSON.stringify(prevOtherUsersQuestion.current) !== JSON.stringify(otherUsersQuestion)) {
      console.log('State changed, re-rendering component.');
      prevOtherUsersQuestion.current = otherUsersQuestion; 
    } else {
      console.log('No state change, preventing re-render.');
    }
  }, [otherUsersQuestion]);

  const countOnlineUsers = useMemo(() => {
    const usersAnswering = Object.values(otherUsersQuestion).filter(user => user.inRoom && user.questionNumber === brojac).length;
    const usersAnswered = Object.values(otherUsersQuestion).filter(user => user.inRoom && user.questionNumber !== brojac).length;
    return { usersAnswering, usersAnswered };
  }, [otherUsersQuestion, brojac]);

  const { usersAnswering, usersAnswered } = countOnlineUsers;

  return (
    <>
      <div>
        <div className='questionsContainer'>
          <MdArrowBack onClick={handleBack} className='backButton'></MdArrowBack>
          <div className="questionBody">
            <h2 className="questionHeading">
              {quizData[currentQuestionIndex]?.question}
              <Counter brojac={brojac}></Counter> <div>{time}s</div>
            </h2>
          </div>

          <div className="answersContainer">
            {quizData[currentQuestionIndex]?.answers.map((answer, index) => (
              <div
                key={index}
                className={`answerRectangle ${selectedAnswer === answer ? (answer === quizData[currentQuestionIndex].correctAnswer ? 'correct' : 'incorrect') : ''}`}
                onClick={() => handleAnswerClick(answer)}
              >
                {answer}
              </div>
            ))}
          </div>
          <div className="buttonContainer">
            <Button onClick={handleNextClick} title={'Next'}></Button>
          </div>
        </div>
        <div className="otherUsersQuestion">
          <h3>Other Users' Progress:</h3>
          <p>Online users answering this question: {usersAnswering}</p>
          <p>Online users who answered this question: {usersAnswered}</p>
          {console.log('Rendering otherUsersQuestion:', otherUsersQuestion)}
        </div>
      </div>
    </>
  );
}

export default QuestionsPage2;
