# 🖱️ Mouse Remote Control

A complete web-based remote mouse automation system combining a Flask REST API backend with a modern React frontend. Control your mouse from any web browser with real-time position tracking, precision clicking, and automated click patterns.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.8+-green)
![Node](https://img.shields.io/badge/node-16+-green)
![License](https://img.shields.io/badge/license-MIT-orange)

## ✨ Features

- **📍 Real-time Position Tracking** - Monitor mouse coordinates in real-time with live updates
- **🖱️ Precision Clicking** - Click at exact screen coordinates
- **➡️ Smart Mouse Movement** - Move by relative offsets or use directional controls
- **🔄 Automated Patterns** - Execute complex click patterns with custom timing
- **🛡️ Safety First** - Built-in failsafe and boundary protection
- **⚛️ Modern React UI** - Beautiful, responsive interface
- **🔌 REST API** - Full REST API for programmatic access
- **📚 Complete Documentation** - Comprehensive docs and examples
- **🎨 Component Architecture** - Well-organized, reusable components

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mouse-remote
```

2. **Start the Python Server**
```bash
cd PythonServer
pip install -r requirements.txt
python cli.py
```

3. **Start the React App** (in new terminal)
```bash
cd ReactApp
npm install
npm run dev
```

4. **Open in Browser**
```
http://localhost:5173
```

## 📖 Documentation

- **[Getting Started](./GETTING_STARTED.md)** - Setup and installation guide
- **[Integration Guide](./INTEGRATION.md)** - Complete integration documentation
- **[API Documentation](./PythonServer/README.md)** - Server API reference
- **[Server HTML Docs](http://localhost:5000/api/documentation)** - Interactive API docs (when server running)

## 🏗️ Project Structure

```
mouse-remote/
├── PythonServer/                 # Flask REST API Server
│   ├── cli.py                   # Main application
│   ├── requirements.txt         # Python dependencies
│   ├── README.md                # Server documentation
│   ├── templates/
│   │   ├── index.html
│   │   └── documentation.html   # Interactive API docs
│   └── static/
│       ├── app.js
│       └── style.css
│
├── ReactApp/                     # React Frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── CoordinateTracker.jsx
│   │   │   ├── ClickController.jsx
│   │   │   ├── MouseMover.jsx
│   │   │   └── ClickPatternExecutor.jsx
│   │   ├── hooks/               # Custom hooks
│   │   │   └── useMouseRemote.js
│   │   ├── styles/              # Component styles
│   │   ├── App.jsx              # Main app
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── GETTING_STARTED.md           # Setup guide
├── INTEGRATION.md               # Detailed integration guide
└── README.md                    # This file
```

## 🎯 Main Features

### 1. Coordinate Tracker 📍
Monitor your mouse position in real-time with live updates every 300ms.

```javascript
<CoordinateTracker updateInterval={300} />
```

### 2. Click Controller 🖱️
Click at specific coordinates with preset quick-click buttons.

```javascript
<ClickController />
```

### 3. Mouse Mover ➡️
Move your mouse by relative offsets or using directional pads.

```javascript
<MouseMover />
```

### 4. Click Pattern Executor 🔄
Execute complex automated click sequences with custom timing and presets.

```javascript
<ClickPatternExecutor />
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api` | API overview |
| GET | `/api/coordinates` | Current mouse position |
| POST | `/api/click` | Click at coordinates |
| POST | `/api/move` | Move by offset |
| POST | `/api/reset` | Reset to (10, 10) |
| POST | `/api/click_pattern` | Execute pattern |

## 💻 Usage Examples

### Basic Click
```javascript
import { useMouseRemote } from './hooks/useMouseRemote';

function MyComponent() {
  const { click, loading } = useMouseRemote();

  const handleClick = async () => {
    await click(500, 300);
  };

  return <button onClick={handleClick}>Click</button>;
}
```

### Execute Pattern
```javascript
const { executeClickPattern } = useMouseRemote();

await executeClickPattern({
  positions: [[100, 100], [200, 200], [300, 300]],
  repeat: 2,
  delay: 5,
  sleep_time: 0.5
});
```

### Real-time Tracking
```javascript
useEffect(() => {
  const interval = setInterval(async () => {
    const coords = await getCoordinates();
    setPosition(coords);
  }, 300);
  
  return () => clearInterval(interval);
}, [getCoordinates]);
```

## 🛡️ Safety Features

- **Failsafe Mode**: Move mouse to screen corner to stop automation
- **Boundary Protection**: Prevents mouse from moving below (10, 10)
- **Input Validation**: All inputs are validated and sanitized
- **Error Handling**: Comprehensive error messages and recovery
- **State Management**: Proper error and loading states

## ⚙️ Configuration

### Python Server (cli.py)
- **Host**: `0.0.0.0` (accessible from anywhere)
- **Port**: `5000`
- **Debug**: `True` (set to False in production)

### React App (vite.config.js)
- **Development Server Port**: `5173`
- **API Base URL**: `http://localhost:5000/api`

### Custom Hook (useMouseRemote.js)
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 🚀 Performance Tips

1. **Batch Operations** - Group multiple clicks together
2. **Interval Management** - Balance update frequency with performance
3. **Component Memoization** - Use React.memo for optimization
4. **State Deduplication** - Avoid duplicate state updates
5. **API Caching** - Cache coordinates when appropriate

## 🐛 Troubleshooting

### Connection Issues
```bash
# Check if Python server is running
curl http://localhost:5000/api

# Check if React app is running
curl http://localhost:5173
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000
```

### CORS Errors
Ensure Flask-CORS is installed:
```bash
pip install flask-cors
```

### Mouse Not Responding
- Move mouse to screen corner (triggers failsafe)
- Restart the server
- Check permissions

## 📚 Learning Resources

- [PyAutoGUI Documentation](https://pyautogui.readthedocs.io/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [REST API Best Practices](https://restfulapi.net/)

## 🔐 Security Considerations

⚠️ **Important**: This application provides direct system control. Use responsibly:

- ✅ Only run on trusted networks
- ✅ Add authentication for public deployment
- ✅ Implement rate limiting
- ✅ Log all operations
- ✅ Use HTTPS in production
- ✅ Never expose without user consent

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Development

### Technologies Used
- **Backend**: Flask, PyAutoGUI
- **Frontend**: React, Vite
- **Styling**: CSS3
- **Communication**: REST API, JSON

### Development Tools
- VS Code
- Python 3.8+
- Node.js 16+
- Git

## 📞 Support

For issues and questions:
1. Check the [Getting Started Guide](./GETTING_STARTED.md)
2. Review the [Integration Guide](./INTEGRATION.md)
3. Check API docs at `http://localhost:5000/api/documentation`
4. Review code comments for implementation details

## 🎉 Acknowledgments

- Built with Flask and React
- Powered by PyAutoGUI
- Inspired by automation best practices

## 📋 Changelog

### Version 1.0.0
- ✅ Initial release
- ✅ Complete API implementation
- ✅ React UI with 4 main components
- ✅ Custom React hook
- ✅ Comprehensive documentation
- ✅ Safety features and error handling

## 🚦 Roadmap

- [ ] WebSocket support for real-time updates
- [ ] Recording and playback of patterns
- [ ] Multi-user support
- [ ] Authentication system
- [ ] Advanced scheduling
- [ ] Cross-platform optimization

---

**Created**: 2026  
**Version**: 1.0.0  
**Status**: Production Ready

**Happy automating!** 🖱️✨
