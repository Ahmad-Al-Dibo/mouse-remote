# Mouse Remote Control - Complete Integration Guide

## 📚 Table of Contents
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [API Reference](#api-reference)
- [React Integration](#react-integration)
- [Real-World Examples](#real-world-examples)
- [Advanced Usage](#advanced-usage)
- [Troubleshooting](#troubleshooting)

---

## Project Structure

```
mouse-remote/
├── PythonServer/                    # Flask REST API Server
│   ├── cli.py                       # Main Flask application
│   ├── README.md                    # Server documentation
│   ├── templates/
│   │   ├── index.html              # Web UI
│   │   └── documentation.html      # Interactive API docs
│   └── static/
│       ├── app.js                  # Client-side JavaScript
│       └── style.css               # Styling
│
└── ReactApp/                        # React Frontend Application
    ├── src/
    │   ├── App.jsx                 # Main app component
    │   ├── App.css                 # Main styling
    │   ├── main.jsx                # Entry point
    │   ├── components/
    │   │   ├── CoordinateTracker.jsx    # Track mouse position
    │   │   ├── ClickController.jsx      # Click at coordinates
    │   │   ├── MouseMover.jsx           # Move mouse
    │   │   └── ClickPatternExecutor.jsx # Execute patterns
    │   ├── hooks/
    │   │   └── useMouseRemote.js   # Custom React hook
    │   └── styles/
    │       ├── CoordinateTracker.css
    │       ├── ClickController.css
    │       ├── MouseMover.css
    │       └── ClickPatternExecutor.css
    ├── package.json
    ├── vite.config.js
    └── README.md
```

---

## Quick Start

### 1. Start the Python Server

```bash
cd PythonServer
pip install flask pyautogui
python cli.py
```

Server will run on: `http://localhost:5000`

### 2. Start the React App

```bash
cd ReactApp
npm install
npm run dev
```

React app will run on: `http://localhost:5173` (or shown in terminal)

### 3. Open in Browser

Navigate to the React app URL and start controlling your mouse!

---

## Architecture Overview

### System Design

```
┌─────────────────────────────────────────┐
│      React Frontend (Port 5173)         │
│  ┌─────────────────────────────────┐   │
│  │  App.jsx (Main Container)       │   │
│  │  ├─ CoordinateTracker           │   │
│  │  ├─ ClickController             │   │
│  │  ├─ MouseMover                  │   │
│  │  └─ ClickPatternExecutor        │   │
│  └─────────────────────────────────┘   │
└────────────┬────────────────────────────┘
             │ HTTP REST Calls
             │ JSON Data
             │
┌────────────▼────────────────────────────┐
│  Flask Server (Port 5000)               │
│  ┌─────────────────────────────────┐   │
│  │  REST API Routes                │   │
│  │  ├─ GET /api/coordinates        │   │
│  │  ├─ POST /api/click             │   │
│  │  ├─ POST /api/move              │   │
│  │  ├─ POST /api/reset             │   │
│  │  └─ POST /api/click_pattern     │   │
│  └─────────────────────────────────┘   │
└────────────┬────────────────────────────┘
             │ PyAutoGUI
             │
┌────────────▼────────────────────────────┐
│      System Mouse Control               │
│      (Windows, Mac, Linux)              │
└─────────────────────────────────────────┘
```

### Data Flow

1. **User interacts with React component**
2. **Component calls API via HTTP**
3. **Flask server receives request**
4. **PyAutoGUI controls mouse**
5. **Response sent back to React**
6. **UI updates with result**

---

## API Reference

### Base URL
```
http://localhost:5000/api
```

### 1. Get Coordinates
```http
GET /coordinates
```
**Response:**
```json
{
  "x": 1024,
  "y": 768
}
```

### 2. Click
```http
POST /click
Content-Type: application/json

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

### 3. Move
```http
POST /move
Content-Type: application/json

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

### 4. Reset
```http
POST /reset
```
**Response:**
```json
{
  "status": "success"
}
```

### 5. Click Pattern
```http
POST /click_pattern
Content-Type: application/json

{
  "positions": [[100, 100], [200, 200], [300, 300]],
  "repeat": 3,
  "delay": 60,
  "sleep_time": 0.5,
  "automationEnabled": true
}
```
**Response:**
```json
{
  "status": "success"
}
```

---

## React Integration

### Using the Custom Hook

```javascript
import { useMouseRemote } from './hooks/useMouseRemote';

function MyComponent() {
  const { 
    getCoordinates, 
    click, 
    move, 
    reset,
    executeClickPattern,
    loading, 
    error 
  } = useMouseRemote();

  // Use the methods
  const handleClick = async () => {
    try {
      await click(500, 300);
      console.log('Clicked!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        Click
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### Component Examples

#### Real-time Position Tracker
```javascript
import { useEffect, useState } from 'react';
import { useMouseRemote } from './hooks/useMouseRemote';

function PositionTracker() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const { getCoordinates } = useMouseRemote();

  useEffect(() => {
    const interval = setInterval(async () => {
      const coords = await getCoordinates();
      setPos(coords);
    }, 100);

    return () => clearInterval(interval);
  }, [getCoordinates]);

  return <div>Position: ({pos.x}, {pos.y})</div>;
}
```

#### Click on Element Position
```javascript
function ClickOnElement() {
  const { click } = useMouseRemote();

  const handleClickElement = async (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    await click(x, y);
  };

  return <button onClick={handleClickElement}>Click Here</button>;
}
```

---

## Real-World Examples

### Example 1: Automated Form Filling

```javascript
async function fillForm() {
  const { executeClickPattern } = useMouseRemote();

  await executeClickPattern({
    positions: [
      [100, 100],   // Click first input field
      [200, 150],   // Click second field
      [300, 200]    // Click submit button
    ],
    repeat: 1,
    sleep_time: 0.5
  });
}
```

### Example 2: Repetitive Task Automation

```javascript
async function repeatClick() {
  const { click } = useMouseRemote();

  for (let i = 0; i < 10; i++) {
    await click(500, 500);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

### Example 3: Screenshot Region Selection

```javascript
function ScreenshotRegion() {
  const { click, getCoordinates } = useMouseRemote();
  const [selecting, setSelecting] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const handleStart = async () => {
    setSelecting(true);
    const pos = await getCoordinates();
    setStart(pos);
  };

  const handleEnd = async () => {
    const pos = await getCoordinates();
    setEnd(pos);
    setSelecting(false);
    console.log(`Selected region: ${start.x},${start.y} to ${pos.x},${pos.y}`);
  };

  return (
    <div>
      <button onClick={handleStart}>Start Selection</button>
      <button onClick={handleEnd} disabled={!selecting}>
        End Selection
      </button>
      {end && <p>Region: ({start.x},{start.y}) - ({end.x},{end.y})</p>}
    </div>
  );
}
```

---

## Advanced Usage

### Custom API Client

```javascript
class MouseRemoteClient {
  constructor(baseUrl = 'http://localhost:5000/api') {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, method = 'GET', data = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (data) options.body = JSON.stringify(data);

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    return response.json();
  }

  async getCoordinates() {
    return this.request('/coordinates');
  }

  async click(x, y) {
    return this.request('/click', 'POST', { x, y });
  }

  async move(add_x, add_y) {
    return this.request('/move', 'POST', { add_x, add_y });
  }

  async executePattern(pattern) {
    return this.request('/click_pattern', 'POST', pattern);
  }
}

// Usage
const client = new MouseRemoteClient();
await client.click(500, 300);
```

### Batch Operations

```javascript
async function batchOperations() {
  const { click, move } = useMouseRemote();

  const operations = [
    { type: 'click', x: 100, y: 100 },
    { type: 'move', add_x: 50, add_y: 50 },
    { type: 'click', x: 150, y: 150 }
  ];

  for (const op of operations) {
    if (op.type === 'click') {
      await click(op.x, op.y);
    } else if (op.type === 'move') {
      await move(op.add_x, op.add_y);
    }
    await new Promise(r => setTimeout(r, 500));
  }
}
```

### Error Handling & Retry Logic

```javascript
async function reliableClick(x, y, maxRetries = 3) {
  const { click } = useMouseRemote();

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await click(x, y);
      console.log(`Click succeeded on attempt ${attempt}`);
      return true;
    } catch (error) {
      console.warn(`Attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
  }

  throw new Error(`Failed to click after ${maxRetries} attempts`);
}
```

---

## Troubleshooting

### Issue: "Connection Refused"
**Solution:**
- Ensure Flask server is running: `python cli.py`
- Check if port 5000 is available
- Try accessing `http://localhost:5000/api` in browser

### Issue: CORS Errors
**Solution:**
Install Flask-CORS:
```bash
pip install flask-cors
```

Add to `cli.py`:
```python
from flask_cors import CORS
CORS(app)
```

### Issue: Mouse Not Moving
**Solution:**
- Trigger failsafe by moving mouse to screen corner
- Check permissions (may need admin rights)
- Verify coordinates are within screen bounds

### Issue: Slow Response
**Solution:**
- Check network latency
- Ensure server isn't overloaded
- Use batching instead of individual requests

### Issue: React Components Not Importing
**Solution:**
- Ensure all component files exist
- Check file paths are correct
- Verify hooks are properly exported

---

## Performance Tips

1. **Batch requests** instead of individual calls
2. **Use intervals wisely** for coordinate tracking
3. **Minimize re-renders** with proper state management
4. **Cache coordinates** when not needed in real-time
5. **Use debouncing** for frequent operations

---

## Security Considerations

⚠️ **Important:** This API provides direct system mouse control. Use with caution:

- **Network Security**: Only expose on trusted networks
- **Authentication**: Add user authentication if exposing publicly
- **Rate Limiting**: Implement to prevent abuse
- **Logging**: Log all operations for audit trails
- **Failsafe**: Always have manual override capability

---

## Support & Resources

- **Server Docs**: `http://localhost:5000/api/documentation`
- **Python Server README**: See [PythonServer/README.md](./PythonServer/README.md)
- **PyAutoGUI Docs**: https://pyautogui.readthedocs.io/
- **React Docs**: https://react.dev/

---

**Last Updated**: 2026  
**Version**: 1.0.0
