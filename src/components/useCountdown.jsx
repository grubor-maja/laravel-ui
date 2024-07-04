import { useState, useEffect, useCallback } from 'react';

const useCountdown = (initialTime, onFinish) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);

  const reset = useCallback(() => {
    setTime(initialTime);
    setIsRunning(true);
  }, [initialTime]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isRunning]);

  useEffect(() => {
    if (time === 0) {
      setIsRunning(false);
      onFinish();
    }
  }, [time, onFinish]);

  return {
    time,
    reset,
    pause,
  };
};

export default useCountdown;