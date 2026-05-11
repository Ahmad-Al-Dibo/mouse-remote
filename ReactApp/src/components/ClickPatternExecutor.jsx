import { useState } from 'react';
import { useMouseRemote } from '../hooks/useMouseRemote';
import '../styles/ClickPatternExecutor.css';

/**
 * Component to execute complex click patterns with custom timing
 */
const ClickPatternExecutor = () => {
  const [positions, setPositions] = useState(
    '[[100, 100], [200, 200], [300, 300]]'
  );
  const [repeat, setRepeat] = useState(1);
  const [delay, setDelay] = useState(60);
  const [sleepTime, setSleepTime] = useState(0.5);
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [feedback, setFeedback] = useState('');
  const { executeClickPattern, loading, error } = useMouseRemote();

  const handleExecute = async () => {
    setFeedback('');
    try {
      const posArray = JSON.parse(positions);

      if (!Array.isArray(posArray)) {
        throw new Error('Positions must be an array');
      }

      await executeClickPattern({
        positions: posArray,
        repeat: parseInt(repeat) || 1,
        delay: parseFloat(delay) || 60,
        sleep_time: parseFloat(sleepTime) || 0.5,
        automationEnabled: automationEnabled
      });

      setFeedback('✓ Pattern executed successfully!');
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      setFeedback(`✗ Error: ${err.message}`);
      setTimeout(() => setFeedback(''), 4000);
    }
  };

  const handlePresetPattern = (pattern) => {
    setPositions(JSON.stringify(pattern));
  };

  const presetPatterns = {
    Square: [[100, 100], [100, 300], [300, 300], [300, 100]],
    Triangle: [[200, 100], [100, 300], [300, 300]],
    Cross: [[250, 100], [250, 300], [100, 200], [400, 200]],
    Circle: [[300, 100], [380, 130], [400, 220], [350, 320], [250, 350], [150, 320], [100, 220], [120, 130]]
  };

  return (
    <div className="click-pattern-executor">
      <div className="executor-header">
        <h3>🔄 Click Pattern Executor</h3>
      </div>

      <div className="executor-content">
        <div className="input-section">
          <div className="form-group">
            <label htmlFor="positions">Positions (JSON):</label>
            <textarea
              id="positions"
              value={positions}
              onChange={(e) => setPositions(e.target.value)}
              rows={4}
              className="positions-textarea"
              placeholder="[[x1, y1], [x2, y2], ...]"
            />
          </div>

          <div className="preset-buttons">
            <p className="preset-label">Presets:</p>
            {Object.entries(presetPatterns).map(([name, pattern]) => (
              <button
                key={name}
                onClick={() => handlePresetPattern(pattern)}
                className="preset-btn"
                title={`Use ${name} pattern`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="parameters-section">
          <div className="form-group">
            <label htmlFor="repeat">Repeat:</label>
            <input
              id="repeat"
              type="number"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              min="1"
              max="100"
              className="param-input"
            />
            <small>Times to repeat the pattern</small>
          </div>

          <div className="form-group">
            <label htmlFor="delay">Delay between repeats (seconds):</label>
            <input
              id="delay"
              type="number"
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
              min="0"
              step="0.5"
              className="param-input"
            />
            <small>Wait time between pattern repetitions</small>
          </div>

          <div className="form-group">
            <label htmlFor="sleep-time">Sleep time between clicks (seconds):</label>
            <input
              id="sleep-time"
              type="number"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              min="0.1"
              max="10"
              step="0.1"
              className="param-input"
            />
            <small>Delay between each click in the pattern</small>
          </div>

          <div className="checkbox-group">
            <label htmlFor="automation">
              <input
                id="automation"
                type="checkbox"
                checked={automationEnabled}
                onChange={(e) => setAutomationEnabled(e.target.checked)}
              />
              Enable Automation
            </label>
            <small>Disable to test without executing clicks</small>
          </div>
        </div>

        <button
          onClick={handleExecute}
          disabled={loading}
          className="execute-btn primary"
        >
          {loading ? '⏳ Executing...' : '🚀 Execute Pattern'}
        </button>

        {error && <div className="error-message">⚠️ {error}</div>}
        {feedback && (
          <div className={`feedback-message ${feedback.startsWith('✓') ? 'success' : 'error'}`}>
            {feedback}
          </div>
        )}

        <div className="info-box">
          <p>
            <strong>ℹ️ Info:</strong> Press any screen corner to stop automation (failsafe)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClickPatternExecutor;
