import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import useCountdown from './useCountdown';
import Counter from './Counter';
import { useLocation } from 'react-router-dom';
import { MdArrowBack } from "react-icons/md";
import Pusher from 'pusher-js';

const QuestionsPage2 = ({ result, handleResult, timeLeftMultiplier, difficulty, roomName, roomCode, username }) => {
  console.log('QuestionsPage2 component rendered'); // Log when component re-renders

  const [quizData, setQuizData] = useState({
    question: '',
    answers: [],
    correctAnswer: '',
  });

  const [otherUsersQuestion, setOtherUsersQuestion] = useState({});
  const location = useLocation();
  const { room } = location.state;

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selected, setSelected] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [brojac2, setBrojac2] = useState(0);
  const prevOtherUsersQuestion = useRef({});

  const [brojac, setBrojac] = useState(1);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  }

  const handleCountdownFinish = () => {
    if (!selected) {
      console.log('Vreme je isteklo!');
      setTimeLeft(0);
      pauseCountdown();
      handleNextClick();
    }
  };

  const { time, reset: resetCountdown, pause: pauseCountdown } = useCountdown(10, handleCountdownFinish);

  const handleNextClick = () => {
    if (!username) {
      console.error('Username is missing');
      return;
    }

    console.log('Emitting event with data:', {
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
        setBrojac((prevBrojac) => prevBrojac + 1);
        resetCountdown();

        if (brojac < 10) {
          setNextQuestion();
        } else {
          console.log(roomName);
          console.log(username);
          console.log(result);
          localStorage.setItem('user', username);
          localStorage.setItem('result', result);
          localStorage.setItem('naziv_sobe', roomName);
          navigate('/results', { state: { timeLeft } });
        }
      })
      .catch(error => {
        console.error('Error emitting event:', error);
      });
  };

  const handleAnswerClick = (answer) => {
    if (!selected) {
      setSelectedAnswer(answer);
      setSelected(true);

      console.log('Time left: ' + time);
      let scoreMultiplier = answer === quizData.correctAnswer ? 10 : 0;
      console.log('Score multiplier: ' + scoreMultiplier);
      pauseCountdown();

      const roundResult = time * scoreMultiplier;
      console.log('Broj poena za ovaj odgovor: ' + roundResult);
      handleResult(result + roundResult);
    } else {
      console.log('Vec ste izabrali odgovor');
      window.alert('Vec ste izabrali odgovor');
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/sobe/${roomName}/quiz`);
      const data = await response.json();

      const firstRoom = data.soba;
      const firstQuestion = firstRoom.pitanja[brojac - 1];

      setQuizData({
        question: firstQuestion.tekst_pitanja,
        answers: firstQuestion.odgovori.map(odgovor => odgovor.tekst_odgovora),
        correctAnswer: firstQuestion.odgovori.find(odgovor => odgovor.tacan_odgovor === 1).tekst_odgovora
      });
      setBrojac2(brojac2 + 1);
    } catch (error) {
      console.error('Error fetching specific quiz data:', error);
    }
  };

  const fetchUsersProgress = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/room/${roomName}/progress`);
      const data = await response.json();

      const usersProgress = data.reduce((acc, user) => {
        acc[user.username] = user.question_number;
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

  const setNextQuestion = () => {
    setSelectedAnswer(null);
    setSelected(false);
    fetchData();
  };

  useEffect(() => {
    console.log('Room name:', roomName);
    fetchData();
    resetCountdown();

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
          const updatedQuestions = { ...prev, [data.username]: data.questionNumber };
          if (JSON.stringify(prev) !== JSON.stringify(updatedQuestions)) {
            console.log('Updated otherUsersQuestion:', updatedQuestions);
            prevOtherUsersQuestion.current = updatedQuestions; // Update the ref
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
    };
  }, [roomName, resetCountdown]);

  // Periodično osvežavanje
  useEffect(() => {
    const interval = setInterval(fetchUsersProgress, 5000); // Osvežavaj svakih 5 sekundi
    return () => clearInterval(interval);
  }, [fetchUsersProgress]);

  useEffect(() => {
    console.log('otherUsersQuestion updated:', otherUsersQuestion);
    if (JSON.stringify(prevOtherUsersQuestion.current) !== JSON.stringify(otherUsersQuestion)) {
      console.log('State changed, re-rendering component.');
      prevOtherUsersQuestion.current = otherUsersQuestion; // Update the ref
    } else {
      console.log('No state change, preventing re-render.');
    }
  }, [otherUsersQuestion]);

  return (
    <>
      <div>
        <div className='questionsContainer'>
          <MdArrowBack onClick={handleBack} className='backButton'></MdArrowBack>
          <div className="questionBody">
            <h2 className="questionHeading">
              {quizData.question}
              <Counter brojac={brojac}></Counter> <div>{time}s</div>
            </h2>
          </div>

          <div className="answersContainer">
            {quizData.answers.map((answer, index) => (
              <div
                key={index}
                className={`answerRectangle ${selectedAnswer === answer ? (answer === quizData.correctAnswer ? 'correct' : 'incorrect') : ''}`}
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
          <ul>
            {Object.entries(otherUsersQuestion).map(([user, questionNumber]) => (
              <li key={user}>{user}: Question {questionNumber}</li>
            ))}
          </ul>
          {console.log('Rendering otherUsersQuestion:', otherUsersQuestion)}
        </div>
      </div>
    </>
  );
}

export default QuestionsPage2;
