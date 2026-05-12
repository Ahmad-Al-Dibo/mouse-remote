import { useState, useEffect } from 'react';
import { useMouseRemote } from '../hooks/useMouseRemote';
import '../styles/CoordinateTracker.css';

/**
 * Component to track and display current mouse coordinates
 * Updates every 500ms by default
 */
const CoordinateTracker = ({ updateInterval = 500 }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const { getCoordinates, loading, error } = useMouseRemote();

  useEffect(() => {
    // Initial fetch
    const fetchCoords = async () => {
      try {
        const data = await getCoordinates();
        setCoords(data);
      } catch (err) {
        console.error('Error fetching coordinates:', err);
      }
    };

    fetchCoords();

    // Set up interval for continuous tracking
    const interval = setInterval(fetchCoords, updateInterval);

    return () => clearInterval(interval);
  }, [getCoordinates, updateInterval]);

  return (
    <div className="coordinate-tracker">
      <div className="tracker-header">
        <h3>📍 Mouse Position Tracker</h3>
        {loading && <span className="loading-indicator">●</span>}
      </div>

      <div className="tracker-content">
        <div className="coordinate-display">
          <div className="coord-item">
            <span className="coord-label">X:</span>
            <span className="coord-value">{coords.x}</span>
          </div>
          <div className="coord-item">
            <span className="coord-label">Y:</span>
            <span className="coord-value">{coords.y}</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="tracker-info">
          <small>Updates every {updateInterval}ms</small>
        </div>
      </div>
    </div>
  );
};

export default CoordinateTracker;
