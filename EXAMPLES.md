# Mouse Remote Control - Complete Examples

Real-world examples demonstrating how to use the Mouse Remote Control API with JavaScript and React.

## Table of Contents
- [JavaScript Fetch Examples](#javascript-fetch-examples)
- [React Component Examples](#react-component-examples)
- [Advanced Patterns](#advanced-patterns)
- [Production Use Cases](#production-use-cases)

---

## JavaScript Fetch Examples

### 1. Simple Click

```javascript
async function clickOnScreen() {
  try {
    const response = await fetch('http://localhost:5000/api/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x: 500, y: 300 })
    });
    
    const data = await response.json();
    console.log('Click result:', data);
  } catch (error) {
    console.error('Error clicking:', error);
  }
}

clickOnScreen();
```

### 2. Get Mouse Position

```javascript
async function getMousePosition() {
  try {
    const response = await fetch('http://localhost:5000/api/coordinates');
    const data = await response.json();
    console.log(`Mouse at: (${data.x}, ${data.y})`);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

getMousePosition();
```

### 3. Move Mouse by Offset

```javascript
async function moveMouseRight() {
  try {
    const response = await fetch('http://localhost:5000/api/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ add_x: 100, add_y: 0 })
    });
    
    const data = await response.json();
    console.log(`New position: (${data.x}, ${data.y})`);
  } catch (error) {
    console.error('Error moving:', error);
  }
}

moveMouseRight();
```

### 4. Execute Click Pattern

```javascript
async function executePattern() {
  try {
    const response = await fetch('http://localhost:5000/api/click_pattern', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        positions: [[100, 100], [200, 200], [300, 300]],
        repeat: 2,
        delay: 5,
        sleep_time: 0.5,
        automationEnabled: true
      })
    });
    
    const data = await response.json();
    console.log('Pattern result:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

executePattern();
```

### 5. Continuous Position Tracking

```javascript
function trackMousePosition() {
  const interval = setInterval(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/coordinates');
      const data = await response.json();
      console.log(`Position: (${data.x}, ${data.y})`);
      
      // Update UI
      document.getElementById('position').textContent = 
        `X: ${data.x}, Y: ${data.y}`;
    } catch (error) {
      console.error('Error:', error);
    }
  }, 500); // Update every 500ms
  
  return interval;
}

// Start tracking
const trackingInterval = trackMousePosition();

// Stop tracking
// clearInterval(trackingInterval);
```

---

## React Component Examples

### 1. Simple Click Button Component

```javascript
import React, { useState } from 'react';

export function SimpleClickButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x: 500, y: 300 })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('Clicked successfully!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Clicking...' : 'Click at (500, 300)'}
      </button>
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
    </div>
  );
}
```

### 2. Position Display Component

```javascript
import React, { useState, useEffect } from 'react';

export function PositionDisplay() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:5000/api/coordinates');
        const data = await response.json();
        setPosition(data);
      } catch (error) {
        console.error('Error fetching position:', error);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>Current Mouse Position</h3>
      <p>X: <strong>{position.x}</strong></p>
      <p>Y: <strong>{position.y}</strong></p>
    </div>
  );
}
```

### 3. Custom Input Click Component

```javascript
import React, { useState } from 'react';

export function CustomClickInput() {
  const [x, setX] = useState(500);
  const [y, setY] = useState(300);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleClick = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          x: parseInt(x), 
          y: parseInt(y) 
        })
      });
      
      const data = await response.json();
      setStatus('✓ Clicked!');
      setTimeout(() => setStatus(''), 2000);
    } catch (error) {
      setStatus('✗ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div>
        <label>X: </label>
        <input 
          type="number" 
          value={x} 
          onChange={(e) => setX(e.target.value)}
        />
      </div>
      
      <div>
        <label>Y: </label>
        <input 
          type="number" 
          value={y} 
          onChange={(e) => setY(e.target.value)}
        />
      </div>
      
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Clicking...' : 'Click'}
      </button>
      
      {status && <p>{status}</p>}
    </div>
  );
}
```

### 4. Pattern Executor Component

```javascript
import React, { useState } from 'react';

export function PatternExecutor() {
  const [positions, setPositions] = useState('[[100, 100], [200, 200], [300, 300]]');
  const [repeat, setRepeat] = useState(1);
  const [delay, setDelay] = useState(60);
  const [sleepTime, setSleepTime] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleExecute = async () => {
    setLoading(true);
    
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
          automationEnabled: true
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setResult('✓ Pattern executed successfully!');
      } else {
        setResult('✗ Pattern execution failed');
      }
      
      setTimeout(() => setResult(''), 3000);
    } catch (error) {
      setResult('✗ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h3>Execute Click Pattern</h3>
      
      <div>
        <label>Positions (JSON):</label>
        <textarea 
          value={positions}
          onChange={(e) => setPositions(e.target.value)}
          rows={3}
          style={{ width: '100%' }}
        />
      </div>
      
      <div>
        <label>Repeat:</label>
        <input 
          type="number" 
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
          min="1"
        />
      </div>
      
      <div>
        <label>Delay (seconds):</label>
        <input 
          type="number" 
          value={delay}
          onChange={(e) => setDelay(e.target.value)}
          step="0.1"
        />
      </div>
      
      <div>
        <label>Sleep Time (seconds):</label>
        <input 
          type="number" 
          value={sleepTime}
          onChange={(e) => setSleepTime(e.target.value)}
          step="0.1"
        />
      </div>
      
      <button onClick={handleExecute} disabled={loading}>
        {loading ? 'Executing...' : 'Execute'}
      </button>
      
      {result && <p><strong>{result}</strong></p>}
    </div>
  );
}
```

---

## Advanced Patterns

### 1. Retry Logic with Exponential Backoff

```javascript
async function clickWithRetry(x, y, maxRetries = 3) {
  let attempt = 1;
  
  while (attempt <= maxRetries) {
    try {
      const response = await fetch('http://localhost:5000/api/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x, y })
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        console.log(`Click succeeded on attempt ${attempt}`);
        return true;
      }
    } catch (error) {
      console.warn(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s...
        const waitTime = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    attempt++;
  }
  
  throw new Error(`Failed to click after ${maxRetries} attempts`);
}

// Usage
await clickWithRetry(500, 300);
```

### 2. Batch Operations

```javascript
async function performBatchOperations(operations) {
  const results = [];
  
  for (const operation of operations) {
    try {
      if (operation.type === 'click') {
        const response = await fetch('http://localhost:5000/api/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ x: operation.x, y: operation.y })
        });
        results.push(await response.json());
      } else if (operation.type === 'move') {
        const response = await fetch('http://localhost:5000/api/move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            add_x: operation.add_x, 
            add_y: operation.add_y 
          })
        });
        results.push(await response.json());
      }
      
      // Wait between operations
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Operation failed:`, error);
      results.push({ error: error.message });
    }
  }
  
  return results;
}

// Usage
const operations = [
  { type: 'click', x: 100, y: 100 },
  { type: 'move', add_x: 50, add_y: 50 },
  { type: 'click', x: 150, y: 150 }
];

await performBatchOperations(operations);
```

### 3. Conditional Click Logic

```javascript
async function smartClick(element) {
  try {
    // Get element position
    const rect = element.getBoundingClientRect();
    const x = Math.round(rect.left + rect.width / 2);
    const y = Math.round(rect.top + rect.height / 2);
    
    console.log(`Clicking element at (${x}, ${y})`);
    
    // Perform click
    const response = await fetch('http://localhost:5000/api/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x, y })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      // Trigger local feedback
      element.style.opacity = '0.5';
      setTimeout(() => element.style.opacity = '1', 200);
    }
    
    return data;
  } catch (error) {
    console.error('Smart click failed:', error);
  }
}

// Usage
const button = document.querySelector('button');
await smartClick(button);
```

---

## Production Use Cases

### 1. Automated Testing

```javascript
async function automatedUITest() {
  const testCases = [
    { name: 'Login', positions: [[200, 200], [500, 300], [700, 150]] },
    { name: 'Dashboard', positions: [[100, 100], [300, 200]] },
    { name: 'Settings', positions: [[900, 50], [400, 300], [800, 200]] }
  ];

  for (const testCase of testCases) {
    console.log(`Running test: ${testCase.name}`);
    
    try {
      const response = await fetch('http://localhost:5000/api/click_pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          positions: testCase.positions,
          repeat: 1,
          sleep_time: 1
        })
      });
      
      const data = await response.json();
      console.log(`✓ ${testCase.name} completed`);
    } catch (error) {
      console.error(`✗ ${testCase.name} failed:`, error);
    }
  }
}
```

### 2. Data Entry Automation

```javascript
async function automateDataEntry(formData) {
  const clicks = [
    { x: 100, y: 100, delay: 200 },  // Focus first field
    { x: 200, y: 200, delay: 200 },  // Focus second field
    { x: 300, y: 300, delay: 200 }   // Click submit
  ];

  for (const click of clicks) {
    try {
      await fetch('http://localhost:5000/api/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x: click.x, y: click.y })
      });
      
      await new Promise(resolve => setTimeout(resolve, click.delay));
    } catch (error) {
      console.error('Data entry failed:', error);
      break;
    }
  }
}
```

### 3. Screenshot Region Selection

```javascript
async function selectRegionForScreenshot() {
  let startPos = null;
  let endPos = null;

  // Get starting position
  const startResponse = await fetch('http://localhost:5000/api/coordinates');
  startPos = await startResponse.json();
  console.log(`Start: (${startPos.x}, ${startPos.y})`);

  // Wait for user to move mouse
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Get ending position
  const endResponse = await fetch('http://localhost:5000/api/coordinates');
  endPos = await endResponse.json();
  console.log(`End: (${endPos.x}, ${endPos.y})`);

  return {
    x: Math.min(startPos.x, endPos.x),
    y: Math.min(startPos.y, endPos.y),
    width: Math.abs(endPos.x - startPos.x),
    height: Math.abs(endPos.y - startPos.y)
  };
}
```

---

## Error Handling Best Practices

```javascript
async function safeMouseOperation(operation) {
  const MAX_RETRIES = 3;
  const TIMEOUT_MS = 5000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(
        `http://localhost:5000/api/${operation.endpoint}`,
        {
          method: operation.method || 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(operation.data),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        return data;
      } else {
        throw new Error(data.message || 'Operation failed');
      }
    } catch (error) {
      console.warn(
        `Attempt ${attempt}/${MAX_RETRIES} failed:`,
        error.message
      );

      if (attempt === MAX_RETRIES) {
        throw error;
      }

      // Exponential backoff
      await new Promise(resolve =>
        setTimeout(resolve, Math.pow(2, attempt - 1) * 1000)
      );
    }
  }
}
```

---

These examples demonstrate the full range of possibilities with the Mouse Remote Control API. Adapt them to your specific use case!

**Last Updated**: 2026  
**Version**: 1.0.0
