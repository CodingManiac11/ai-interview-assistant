import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerProps {
  initialTime: number;
  onTimeUp: () => void;
  autoStart?: boolean;
}

export const useTimer = ({ initialTime, onTimeUp, autoStart = false }: UseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      startTimeRef.current = Date.now() - pausedTimeRef.current;
    }
  }, [isRunning]);

  const pause = useCallback(() => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      setIsRunning(false);
      if (startTimeRef.current) {
        pausedTimeRef.current = Date.now() - startTimeRef.current;
      }
    }
  }, [isRunning, isPaused]);

  const resume = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      setIsRunning(true);
      startTimeRef.current = Date.now() - pausedTimeRef.current;
    }
  }, [isPaused]);

  const reset = useCallback((newTime?: number) => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(newTime || initialTime);
    pausedTimeRef.current = 0;
    startTimeRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [initialTime]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            onTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, onTimeUp]);

  const getElapsedTime = useCallback(() => {
    return initialTime - timeLeft;
  }, [initialTime, timeLeft]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeLeft,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
    stop,
    getElapsedTime,
    formatTime,
  };
};