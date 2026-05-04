import React, { useState, useEffect, useRef, use } from 'react';
import { useMouseRemote } from './hooks/useMouseRemote';
import './App.css';
import CoordinatesHeader from './components/CoordinatesHeader';
import Settings from './components/Settings';
import DirectionalControl from './components/DirectionalControl';
import Touchpad from './components/Touchpad';
import ResetBottom from './components/ResetBottom';

/**
 * Main Application Component - Mouse Remote Control
 * Integrates all mouse remote control features with modern UI
 */
function App() {
  const { getCoordinates, click, move, reset, executeClickPattern, loading, error, clearError } = useMouseRemote();
  
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 }); // implemented in coordinatesHeader.jsx
  const [automationActive, setAutomationActive] = useState(false); // implemented in settings.jsx
  const [pattern, setPattern] = useState([]);
  const [stepSize, setStepSize] = useState(10);
  const [repeatCount, setRepeatCount] = useState(1); // implemented in Settings.jsx
  const [sleepTime, setSleepTime] = useState(0.5); // implemented in Settings.jsx
  const [delay, setDelay] = useState(60); // implemented in Settings.jsx
  const touchpadRef = useRef(null);
  const [touchpadActive, setTouchpadActive] = useState(false);
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 });

  // Update coordinates periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      const coords = await getCoordinates();
      if (coords) {
        setCoordinates(coords);
        console.log('Coordinates updated:', coords);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [getCoordinates]);

  // Handle D-Pad movement
  const moveDir = async (dx, dy) => {
    const result = await move(dx * stepSize, dy * stepSize);
    if (result) {
      setCoordinates(result);
    }
  };

  // Click at current position
  const clickHere = async () => {
    await click(coordinates.x, coordinates.y);
  };

  // Reset mouse to (10, 10)
  const resetMouse = async () => {
    await reset();
    setCoordinates({ x: 10, y: 10 });
  };

  // Record position to pattern
  const recordPosition = () => {
    setPattern([...pattern, [coordinates.x, coordinates.y]]);
  };

  // Execute recorded pattern
  const clickPattern = async () => {
    if (pattern.length === 0) {
      alert('No pattern recorded. Click on coordinates first!');
      return;
    }

    await executeClickPattern({
      positions: pattern,
      repeat: repeatCount,
      delay: delay,
      sleep_time: sleepTime
    });
  };

  // Show pattern
  const showPattern = () => {
    alert(`Pattern: ${JSON.stringify(pattern)}`);
  };

  // Clear pattern
  const clearAutomatation = () => {
    setPattern([]);
    setAutomationActive(false);
  };

  // Toggle automation
  const switchAutomatation = () => {
    setAutomationActive(!automationActive);
  };

  // Touchpad handlers
  const handleTouchpadMouseDown = (e) => {
    setTouchpadActive(true);
    setLastTouch({ x: e.clientX, y: e.clientY });
  };

  const handleTouchpadMouseMove = (e) => {
    if (!touchpadActive) return;

    const dx = e.clientX - lastTouch.x;
    const dy = e.clientY - lastTouch.y;

    moveDir(dx / stepSize, dy / stepSize);
    setLastTouch({ x: e.clientX, y: e.clientY });
  };

  const handleTouchpadMouseUp = () => {
    setTouchpadActive(false);
  };

  useEffect(() => {
    if (touchpadRef.current) {
      touchpadRef.current.addEventListener('mousedown', handleTouchpadMouseDown);
      document.addEventListener('mousemove', handleTouchpadMouseMove);
      document.addEventListener('mouseup', handleTouchpadMouseUp);

      return () => {
        touchpadRef.current?.removeEventListener('mousedown', handleTouchpadMouseDown);
        document.removeEventListener('mousemove', handleTouchpadMouseMove);
        document.removeEventListener('mouseup', handleTouchpadMouseUp);
      };
    }
  }, [touchpadActive, lastTouch]);

  const automationStatus = () => {
    //     background: linear-gradient(135deg, #ff4f4f, #b30000);
    // box-shadow: 0 0 14px rgba(255, 79, 79, 0.7);
        document.getElementById("automationStatus").style.background = automationActive ? "linear-gradient(135deg, #4caf50, #2e7d32)" : "linear-gradient(135deg, #ff4f4f, #b30000)";
        document.getElementById("automationStatus").style.boxShadow = automationActive ? "0 0 14px rgba(76, 175, 80, 0.7)" : "0 0 14px rgba(255, 79, 79, 0.7)";
    }

    useEffect(() => {
        automationStatus();
    }, [automationActive]);

  return (
  <div className="app-container">
    <h1>🖱 Mouse Remote</h1>
    {/* const [repeatCount, setRepeatCount] = useState(1); // implemented in Settings.jsx
  const [sleepTime, setSleepTime] = useState(0.5); // implemented in Settings.jsx
  const [delay, setDelay] = useState(60); // implemented in Settings.jsx */}
    <CoordinatesHeader coordinates={coordinates} setCoordinates={setCoordinates} />
    <Settings automationActive={automationActive}
     setAutomationActive={setAutomationActive}
      automationStatus={automationStatus}
      repeatCount = {repeatCount}
      setRepeatCount = {setRepeatCount}
      sleepTime={sleepTime}
      setSleepTime={setSleepTime}
      delay={delay}
      setDelay ={setDelay}
      />
    <DirectionalControl />
    <Touchpad />
    <ResetBottom />
  </div>

  );
}

export default App;
