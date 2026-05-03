# Mouse Remote Control API 🖱️

A Flask-based REST API for remote mouse automation and control. Enables precise mouse movements, clicks, and automated click patterns across your system.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Examples](#examples)
  - [JavaScript/React Examples](#javascriptreact-examples)
  - [Python Examples](#python-examples)
- [Safety Features](#safety-features)
- [Architecture](#architecture)

## Installation

### Requirements

- Python 3.8+
- Flask
- pyautogui

### Setup

```bash
# Clone or navigate to the project
cd PythonServer

# Install dependencies
pip install flask pyautogui

# Run the server
python cli.py
```

The server will start on `http://localhost:5000`

## Quick Start

### 1. Get Current Mouse Position

```bash
curl http://localhost:5000/api/coordinates
```

Response:
```json
{
  "x": 1024,
  "y": 768
}
```

### 2. Click at Coordinates

```bash
curl -X POST http://localhost:5000/api/click \
  -H "Content-Type: application/json" \
  -d '{"x": 500, "y": 300}'
```

### 3. Execute Click Pattern

```bash
curl -X POST http://localhost:5000/api/click_pattern \
  -H "Content-Type: application/json" \
  -d '{
    "positions": [[100, 100], [200, 200], [300, 300]],
    "repeat": 2,
    "delay": 5,
    "sleep_time": 0.5,
    "automationEnabled": true
  }'
```

## API Documentation

### Endpoints

#### 1. **GET `/api`** - API Overview
Returns all available endpoints and example usage.

**Response:**
```json
{
  "message": "Welkom bij de Click Automation API!",
  "endpoints": {
    "/coordinates (GET)": "Get current mouse coordinates",
    "/reset (POST)": "Reset mouse to (10, 10)",
    "/click (POST)": "Click at specified coordinates",
    "/move (POST)": "Move mouse by offset",
    "/click_pattern (POST)": "Execute click pattern",
    "/documentation": "View documentation"
  }
}
```

#### 2. **GET `/api/coordinates`** - Get Mouse Position
Returns the current mouse cursor position.

**Response:**
```json
{
  "x": 1024,
  "y": 768
}
```

#### 3. **POST `/api/click`** - Click at Coordinates
Clicks the mouse at specified coordinates.

**Request Body:**
```json
{
  "x": 500,
  "y": 300
}
```

**Response:**
```json
{
  "status": "success"
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "x and y are required"
}
```

#### 4. **POST `/api/reset`** - Reset Mouse Position
Resets the mouse cursor to position (10, 10).

**Response:**
```json
{
  "status": "success"
}
```

#### 5. **POST `/api/move`** - Move Mouse by Offset
Moves the mouse by the specified offset amounts.

**Request Body:**
```json
{
  "add_x": 50,
  "add_y": -30
}
```

**Response:**
```json
{
  "x": 1074,
  "y": 738
}
```

**Note:** Minimum position is (10, 10). The API prevents moving too close to edges.

#### 6. **POST `/api/click_pattern`** - Execute Click Pattern
Executes a series of clicks at specified positions with customizable timing.

**Request Body:**
```json
{
  "positions": [[100, 100], [200, 200], [300, 300]],
  "repeat": 3,
  "delay": 60,
  "sleep_time": 0.5,
  "automationEnabled": true
}
```

**Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `positions` | Array of [x, y] | `[[10, 10]]` | List of coordinates to click |
| `repeat` | Integer | `1` | Number of times to repeat the pattern |
| `delay` | Float | `60` | Delay in seconds between repeats |
| `sleep_time` | Float | `0.5` | Delay in seconds between each click |
| `automationEnabled` | Boolean | `true` | Enable/disable automation |

**Response:**
```json
{
  "status": "success"
}
```

#### 7. **GET `/api/documentation`** - View HTML Documentation
Returns HTML documentation page.

## Examples

### JavaScript/React Examples

#### 1. Basic Coordinate Fetcher Component

```javascript
import React, { useState, useEffect } from 'react';

const CoordinateTracker = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCoordinates = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/coordinates');
      const data = await response.json();
      setCoords(data);
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchCoordinates, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tracker">
      <h2>Current Mouse Position</h2>
      <p>X: {coords.x} | Y: {coords.y}</p>
      <button onClick={fetchCoordinates} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh'}
      </button>
    </div>
  );
};

export default CoordinateTracker;
```

#### 2. Click Control Component

```javascript
import React, { useState } from 'react';

const ClickController = () => {
  const [x, setX] = useState(500);
  const [y, setY] = useState(300);
  const [status, setStatus] = useState('');

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x: parseInt(x), y: parseInt(y) })
      });

      const data = await response.json();
      setStatus(data.status === 'success' ? '✓ Clicked!' : '✗ Error');
      setTimeout(() => setStatus(''), 2000);
    } catch (error) {
      setStatus('✗ Connection Error');
      console.error(error);
    }
  };

  return (
    <div className="click-controller">
      <h2>Click Controller</h2>
      <div>
        <label>X Coordinate:</label>
        <input 
          type="number" 
          value={x} 
          onChange={(e) => setX(e.target.value)}
        />
      </div>
      <div>
        <label>Y Coordinate:</label>
        <input 
          type="number" 
          value={y} 
          onChange={(e) => setY(e.target.value)}
        />
      </div>
      <button onClick={handleClick}>Click</button>
      {status && <p className="status">{status}</p>}
    </div>
  );
};

export default ClickController;
```

#### 3. Mouse Movement Component

```javascript
import React, { useState } from 'react';

const MouseMover = () => {
  const [addX, setAddX] = useState(10);
  const [addY, setAddY] = useState(10);
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

  const handleMove = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          add_x: parseInt(addX), 
          add_y: parseInt(addY) 
        })
      });

      const data = await response.json();
      setCurrentPos({ x: data.x, y: data.y });
    } catch (error) {
      console.error('Error moving mouse:', error);
    }
  };

  return (
    <div className="mouse-mover">
      <h2>Move Mouse</h2>
      <div>
        <label>Move X by:</label>
        <input 
          type="number" 
          value={addX} 
          onChange={(e) => setAddX(e.target.value)}
        />
      </div>
      <div>
        <label>Move Y by:</label>
        <input 
          type="number" 
          value={addY} 
          onChange={(e) => setAddY(e.target.value)}
        />
      </div>
      <button onClick={handleMove}>Move</button>
      <p>Current Position: ({currentPos.x}, {currentPos.y})</p>
    </div>
  );
};

export default MouseMover;
```

#### 4. Click Pattern Executor Component

```javascript
import React, { useState } from 'react';

const ClickPatternExecutor = () => {
  const [positions, setPositions] = useState('[[100, 100], [200, 200], [300, 300]]');
  const [repeat, setRepeat] = useState(1);
  const [delay, setDelay] = useState(60);
  const [sleepTime, setSleepTime] = useState(0.5);
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [status, setStatus] = useState('');

  const handleExecute = async () => {
    setExecuting(true);
    setStatus('Executing...');

    try {
      const posArray = JSON.parse(positions);
      
      const response = await fetch('http://localhost:5000/api/click_pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          positions: posArray,
          repeat: parseInt(repeat),
          delay: parseFloat(delay),
          sleep_time: parseFloat(sleepTime),
          automationEnabled: automationEnabled
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setStatus('✓ Pattern executed successfully!');
      } else {
        setStatus(`✗ Error: ${data.message}`);
      }
    } catch (error) {
      setStatus(`✗ Error: ${error.message}`);
      console.error('Error executing pattern:', error);
    } finally {
      setExecuting(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className="click-pattern-executor">
      <h2>Click Pattern Executor</h2>
      
      <div>
        <label>Positions (JSON):</label>
        <textarea 
          value={positions} 
          onChange={(e) => setPositions(e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <label>Repeat:</label>
        <input 
          type="number" 
          value={repeat} 
          min="1"
          onChange={(e) => setRepeat(e.target.value)}
        />
      </div>

      <div>
        <label>Delay between repeats (seconds):</label>
        <input 
          type="number" 
          value={delay} 
          step="0.1"
          onChange={(e) => setDelay(e.target.value)}
        />
      </div>

      <div>
        <label>Sleep time between clicks (seconds):</label>
        <input 
          type="number" 
          value={sleepTime} 
          step="0.1"
          onChange={(e) => setSleepTime(e.target.value)}
        />
      </div>

      <div>
        <label>
          <input 
            type="checkbox" 
            checked={automationEnabled}
            onChange={(e) => setAutomationEnabled(e.target.checked)}
          />
          Enable Automation
        </label>
      </div>

      <button onClick={handleExecute} disabled={executing}>
        {executing ? 'Executing...' : 'Execute Pattern'}
      </button>

      {status && <p className="status">{status}</p>}
    </div>
  );
};

export default ClickPatternExecutor;
```

#### 5. Complete React Application Hook

```javascript
// useMouseRemote.js - Custom Hook
import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

export const useMouseRemote = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const clearError = useCallback(() => setError(null), []);

  const getCoordinates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/coordinates`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const click = useCallback(async (x, y) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x, y })
      });
      const data = await response.json();
      if (data.status !== 'success') throw new Error(data.message);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const move = useCallback(async (add_x, add_y) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ add_x, add_y })
      });
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const executeClickPattern = useCallback(async (options) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/click_pattern`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          positions: options.positions || [[10, 10]],
          repeat: options.repeat || 1,
          delay: options.delay || 60,
          sleep_time: options.sleep_time || 0.5,
          automationEnabled: options.automationEnabled !== false
        })
      });
      const data = await response.json();
      if (data.status !== 'success') throw new Error(data.message);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getCoordinates,
    click,
    move,
    reset,
    executeClickPattern,
    error,
    loading,
    clearError
  };
};
```

#### 6. Usage Example in React Component

```javascript
import React from 'react';
import { useMouseRemote } from './useMouseRemote';

const MouseRemoteApp = () => {
  const { 
    getCoordinates, 
    click, 
    executeClickPattern, 
    error, 
    loading 
  } = useMouseRemote();

  const handleQuickClick = async () => {
    try {
      await click(500, 300);
      alert('Clicked successfully!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handlePattern = async () => {
    try {
      await executeClickPattern({
        positions: [[100, 100], [200, 200], [300, 300]],
        repeat: 2,
        delay: 5,
        sleep_time: 0.5
      });
      alert('Pattern executed!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h1>Mouse Remote Control</h1>
      
      {error && <div className="error">{error}</div>}
      
      <button onClick={handleQuickClick} disabled={loading}>
        Quick Click (500, 300)
      </button>
      
      <button onClick={handlePattern} disabled={loading}>
        Execute Pattern
      </button>
      
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default MouseRemoteApp;
```

### Python Examples

#### 1. Basic Usage

```python
import requests

API_BASE = "http://localhost:5000/api"

# Get current mouse position
response = requests.get(f"{API_BASE}/coordinates")
print(response.json())  # {'x': 1024, 'y': 768}

# Click at coordinates
requests.post(f"{API_BASE}/click", json={"x": 500, "y": 300})

# Move mouse by offset
response = requests.post(f"{API_BASE}/move", json={"add_x": 50, "add_y": -30})
print(response.json())  # {'x': ..., 'y': ...}

# Reset to (10, 10)
requests.post(f"{API_BASE}/reset")
```

#### 2. Automated Click Pattern

```python
import requests
import time

API_BASE = "http://localhost:5000/api"

# Define click pattern
pattern = {
    "positions": [
        [100, 100],   # Top-left
        [500, 500],   # Center
        [900, 100]    # Top-right
    ],
    "repeat": 3,
    "delay": 10,
    "sleep_time": 0.5,
    "automationEnabled": True
}

response = requests.post(f"{API_BASE}/click_pattern", json=pattern)
print(f"Status: {response.json()['status']}")
```

## Safety Features

🛡️ **Failsafe Mode**: Press any corner of the screen to immediately stop automation.

🛡️ **Boundary Protection**: Mouse won't move below (10, 10) - prevents getting stuck at edges.

🛡️ **Validation**: All inputs are validated and converted to proper types before execution.

🛡️ **Error Handling**: Comprehensive error messages for debugging.

## Architecture

```
PythonServer/
├── cli.py                 # Flask app & API logic
├── static/
│   ├── app.js            # Frontend JavaScript
│   └── style.css         # Styling
├── templates/
│   ├── index.html        # Main page
│   └── documentation.html # API documentation
└── README.md             # This file

ReactApp/
├── src/
│   ├── App.jsx           # Main React component
│   ├── main.jsx          # Entry point
│   └── index.css         # Styles
├── package.json          # Dependencies
└── vite.config.js        # Vite configuration
```

## CORS Configuration

If running the React app on a different port, update CORS in `cli.py`:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
```

Install: `pip install flask-cors`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Ensure Python server is running on port 5000 |
| CORS errors | Add Flask-CORS to the server |
| Mouse not moving | Check failsafe - move mouse to screen corner |
| Permission denied | Run with appropriate permissions |

## License

MIT License - Feel free to use and modify.

---

**Created**: 2026
**Version**: 1.0.0
