import { useState } from 'react';
import { useMouseRemote } from '../hooks/useMouseRemote';
import '../styles/MouseMover.css';

/**
 * Component to move mouse by offset amounts
 */
const MouseMover = () => {
  const [addX, setAddX] = useState(10);
  const [addY, setAddY] = useState(10);
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const { move, loading, error } = useMouseRemote();

  const handleMove = async () => {
    try {
      const result = await move(addX, addY);
      setCurrentPos(result);
    } catch (err) {
      console.error('Error moving mouse:', err);
    }
  };

  const handleDirectionalMove = async (dx, dy) => {
    try {
      const result = await move(dx, dy);
      setCurrentPos(result);
    } catch (err) {
      console.error('Error moving mouse:', err);
    }
  };

  return (
    <div className="mouse-mover">
      <div className="mover-header">
        <h3>➡️ Mouse Mover</h3>
      </div>

      <div className="mover-content">
        <div className="input-group">
          <label htmlFor="move-x">Move X by:</label>
          <input
            id="move-x"
            type="number"
            value={addX}
            onChange={(e) => setAddX(e.target.value)}
            placeholder="X offset"
            className="offset-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="move-y">Move Y by:</label>
          <input
            id="move-y"
            type="number"
            value={addY}
            onChange={(e) => setAddY(e.target.value)}
            placeholder="Y offset"
            className="offset-input"
          />
        </div>

        <button
          onClick={handleMove}
          disabled={loading}
          className="move-btn primary"
        >
          {loading ? '⏳ Moving...' : '🎯 Move'}
        </button>

        <div className="directional-controls">
          <p className="directional-label">Directional Movement:</p>
          <div className="direction-pad">
            <button
              onClick={() => handleDirectionalMove(0, -50)}
              disabled={loading}
              className="direction-btn up"
              title="Move Up"
            >
              ⬆️
            </button>
            <div className="horizontal-row">
              <button
                onClick={() => handleDirectionalMove(-50, 0)}
                disabled={loading}
                className="direction-btn left"
                title="Move Left"
              >
                ⬅️
              </button>
              <button
                onClick={() => handleDirectionalMove(0, 50)}
                disabled={loading}
                className="direction-btn down"
                title="Move Down"
              >
                ⬇️
              </button>
              <button
                onClick={() => handleDirectionalMove(50, 0)}
                disabled={loading}
                className="direction-btn right"
                title="Move Right"
              >
                ➡️
              </button>
            </div>
          </div>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}

        {(currentPos.x > 0 || currentPos.y > 0) && (
          <div className="position-info">
            <p>
              Current Position: <strong>({currentPos.x}, {currentPos.y})</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MouseMover;
