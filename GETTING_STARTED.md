# Getting Started with Mouse Remote Control

A complete guide to set up and run the Mouse Remote Control project.

## Prerequisites

- **Python 3.8+**
- **Node.js 16+** with npm
- **Git** (optional, for cloning)

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd mouse-remote
```

Or navigate to the project directory if you already have it.

### Step 2: Set Up Python Server

Navigate to the PythonServer directory:

```bash
cd PythonServer
```

Create a virtual environment (recommended):

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Or install manually:

```bash
pip install flask pyautogui flask-cors
```

Start the Flask server:

```bash
python cli.py
```

You should see:
```
Running on http://0.0.0.0:5000
```

**Server is now running at**: `http://localhost:5000`

### Step 3: Set Up React App

In a **new terminal**, navigate to the ReactApp directory:

```bash
cd ReactApp
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

You should see:
```
VITE v4.x.x ready in xxx ms
➜  Local:   http://localhost:5173/
```

**React app is now running at**: `http://localhost:5173`

### Step 4: Open in Browser

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the Mouse Remote Control interface with navigation tabs.

---

## Verifying Installation

### Test Python Server

Open your browser and go to:
```
http://localhost:5000/api
```

You should see a JSON response with available endpoints.

### Test React App

1. Open `http://localhost:5173`
2. Click on the "📍 Track" tab
3. You should see your current mouse position updating

If both work, you're all set!

---

## Project Structure Overview

```
mouse-remote/
├── PythonServer/
│   ├── cli.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── templates/
│   │   ├── index.html
│   │   └── documentation.html
│   ├── static/
│   │   ├── app.js
│   │   └── style.css
│   └── README.md
│
├── ReactApp/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── styles/         # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── INTEGRATION.md          # Complete integration guide
├── GETTING_STARTED.md      # This file
└── README.md               # Project overview
```

---

## How to Use

### Basic Workflow

1. **Start the servers** (both Python and React)
2. **Open the React app** in your browser
3. **Choose a feature** from the navigation tabs:
   - **📋 Overview** - Project information
   - **📍 Track** - Monitor mouse position
   - **🖱️ Click** - Click at coordinates
   - **➡️ Move** - Move mouse by offset
   - **🔄 Pattern** - Execute click patterns
   - **📚 Docs** - API documentation

### Example: Click at Coordinates

1. Go to the **🖱️ Click** tab
2. Enter X and Y coordinates (e.g., 500, 300)
3. Click the **🎯 Click** button
4. Your mouse will click at that position

### Example: Execute Click Pattern

1. Go to the **🔄 Pattern** tab
2. Use one of the preset patterns (Square, Triangle, Cross, Circle)
3. Adjust the parameters if needed
4. Click **🚀 Execute Pattern**
5. Your mouse will execute the pattern

---

## Available Commands

### Python Server

```bash
# Start server
python cli.py

# Run with debug mode
python cli.py --debug
```

### React App

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## API Endpoints Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api` | Get API overview |
| GET | `/api/coordinates` | Get current mouse position |
| POST | `/api/click` | Click at coordinates |
| POST | `/api/move` | Move mouse by offset |
| POST | `/api/reset` | Reset to (10, 10) |
| POST | `/api/click_pattern` | Execute click pattern |

---

## Troubleshooting

### Python Server Won't Start

**Error**: `ModuleNotFoundError: No module named 'flask'`

**Solution**:
```bash
pip install flask pyautogui flask-cors
```

**Error**: `Port 5000 already in use`

**Solution**: Kill the process using port 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### React App Won't Start

**Error**: `npm: command not found`

**Solution**: Install Node.js from https://nodejs.org/

**Error**: `Dependencies not installed`

**Solution**:
```bash
npm install
npm run dev
```

### Connection Errors

**Error**: `Failed to fetch from localhost:5000`

**Solution**:
1. Ensure Python server is running
2. Check if port 5000 is accessible
3. Add Flask-CORS for cross-origin requests:
   ```bash
   pip install flask-cors
   ```

### Mouse Not Moving

**Cause**: Failsafe triggered

**Solution**: Move mouse to a screen corner to reset

**Cause**: Permission denied

**Solution**: Run terminal as administrator (Windows)

---

## Next Steps

1. **Read the full documentation**: See [INTEGRATION.md](./INTEGRATION.md)
2. **Explore the API**: Visit `http://localhost:5000/api/documentation`
3. **Check out examples**: See real-world usage in [INTEGRATION.md](./INTEGRATION.md#real-world-examples)
4. **Customize**: Modify components and styling to fit your needs

---

## Key Features

✨ **Track** - Real-time mouse position tracking  
🖱️ **Click** - Click at any screen coordinate  
➡️ **Move** - Move mouse by relative offsets  
🔄 **Pattern** - Execute complex click patterns  
🛡️ **Safe** - Built-in failsafe and boundary protection  
⚛️ **React** - Modern React components  
🔌 **REST API** - Full REST API support  

---

## Security Notes

⚠️ This application provides direct system mouse control. Use responsibly:

- Only run on trusted networks
- Don't expose publicly without authentication
- Failsafe can be triggered by moving to screen corners
- All operations should be logged and monitored

---

## Need Help?

1. **Check existing documentation**: Start with [README.md](./PythonServer/README.md)
2. **View API docs**: Open `http://localhost:5000/api/documentation`
3. **Check integration guide**: See [INTEGRATION.md](./INTEGRATION.md#troubleshooting)
4. **Review code comments**: Components are well-documented

---

**Enjoy automating your mouse!** 🖱️✨

For detailed API documentation and advanced examples, see [INTEGRATION.md](./INTEGRATION.md)
