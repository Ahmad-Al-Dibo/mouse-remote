import React, { useState } from 'react';
import { useMouseRemote } from '../hooks/useMouseRemote';
import '../styles/ClickController.css';

/**
 * Component to control mouse clicks at specified coordinates
 */
const ClickController = () => {
  const [x, setX] = useState(500);
  const [y, setY] = useState(300);
  const [feedback, setFeedback] = useState('');
  const { click, loading, error } = useMouseRemote();

  const handleClick = async () => {
    try {
      await click(x, y);
      setFeedback('✓ Clicked successfully!');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback('✗ Click failed');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleQuickClick = async (qx, qy) => {
    setX(qx);
    setY(qy);
    try {
      await click(qx, qy);
      setFeedback(`✓ Quick clicked at (${qx}, ${qy})`);
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback('✗ Click failed');
    }
  };

  return (
    <div className="click-controller">
      <div className="controller-header">
        <h3>🖱️ Click Controller</h3>
      </div>

      <div className="controller-content">
        <div className="input-group">
          <label htmlFor="x-input">X Coordinate:</label>
          <input
            id="x-input"
            type="number"
            value={x}
            onChange={(e) => setX(e.target.value)}
            placeholder="X position"
            className="coord-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="y-input">Y Coordinate:</label>
          <input
            id="y-input"
            type="number"
            value={y}
            onChange={(e) => setY(e.target.value)}
            placeholder="Y position"
            className="coord-input"
          />
        </div>

        <button
          onClick={handleClick}
          disabled={loading}
          className="click-btn primary"
        >
          {loading ? '⏳ Clicking...' : '🎯 Click'}
        </button>

        {error && <div className="error-message">⚠️ {error}</div>}
        {feedback && <div className="feedback-message">{feedback}</div>}

        <div className="quick-clicks">
          <p className="quick-label">Quick Clicks:</p>
          <div className="quick-buttons">
            <button
              onClick={() => handleQuickClick(100, 100)}
              disabled={loading}
              className="quick-btn"
              title="Top-left"
            >
              ↖️ TL
            </button>
            <button
              onClick={() => handleQuickClick(500, 100)}
              disabled={loading}
              className="quick-btn"
              title="Top-center"
            >
              ⬆️ TC
            </button>
            <button
              onClick={() => handleQuickClick(900, 100)}
              disabled={loading}
              className="quick-btn"
              title="Top-right"
            >
              ↗️ TR
            </button>
            <button
              onClick={() => handleQuickClick(500, 500)}
              disabled={loading}
              className="quick-btn"
              title="Center"
            >
              ◉ C
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClickController;
