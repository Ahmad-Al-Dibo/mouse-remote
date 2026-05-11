import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

async function readJsonResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.status === 'error') {
    throw new Error(data.message || fallbackMessage);
  }
  return data;
}

export const useMouseRemote = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const runRequest = useCallback(async (request, fallbackMessage) => {
    setLoading(true);
    try {
      const data = await request();
      setError(null);
      return data;
    } catch (err) {
      const message = err.message || fallbackMessage;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCoordinates = useCallback(() => runRequest(async () => {
    const response = await fetch(`${API_BASE_URL}/coordinates`);
    return readJsonResponse(response, 'Failed to fetch coordinates');
  }, 'Error fetching coordinates'), [runRequest]);

  const click = useCallback((x, y) => runRequest(async () => {
    const response = await fetch(`${API_BASE_URL}/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x: parseInt(x, 10), y: parseInt(y, 10) }),
    });
    return readJsonResponse(response, 'Click failed');
  }, 'Error during click'), [runRequest]);

  const move = useCallback((add_x, add_y) => runRequest(async () => {
    const response = await fetch(`${API_BASE_URL}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        add_x: parseInt(add_x, 10) || 0,
        add_y: parseInt(add_y, 10) || 0,
      }),
    });
    return readJsonResponse(response, 'Failed to move mouse');
  }, 'Error moving mouse'), [runRequest]);

  const reset = useCallback(() => runRequest(async () => {
    const response = await fetch(`${API_BASE_URL}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return readJsonResponse(response, 'Reset failed');
  }, 'Error resetting mouse'), [runRequest]);

  const executeClickPattern = useCallback((options) => runRequest(async () => {
    const response = await fetch(`${API_BASE_URL}/click_pattern`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        positions: options.positions || [[10, 10]],
        repeat: parseInt(options.repeat, 10) || 1,
        delay: parseFloat(options.delay) || 60,
        sleep_time: parseFloat(options.sleep_time) || 0.5,
        automationEnabled: options.automationEnabled !== false,
      }),
    });
    return readJsonResponse(response, 'Pattern execution failed');
  }, 'Error executing click pattern'), [runRequest]);

  const connectTv = useCallback((host = 'local-display') => runRequest(async () => {
    const response = await fetch(`${API_BASE_URL}/tv/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host, platform: 'pc_hdmi' }),
    });
    return readJsonResponse(response, 'TV connection failed');
  }, 'Error connecting TV'), [runRequest]);

  const moveTv = useCallback((targetId, dx, dy) => runRequest(async () => {
    const response = await fetch(`${API_BASE_URL}/tv/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_id: targetId,
        dx: parseInt(dx, 10) || 0,
        dy: parseInt(dy, 10) || 0,
      }),
    });
    return readJsonResponse(response, 'TV mouse move failed');
  }, 'Error moving TV mouse'), [runRequest]);

  const clickTv = useCallback((targetId) => runRequest(async () => {
    const response = await fetch(`${API_BASE_URL}/tv/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_id: targetId }),
    });
    return readJsonResponse(response, 'TV click failed');
  }, 'Error clicking TV'), [runRequest]);

  return {
    getCoordinates,
    click,
    move,
    reset,
    executeClickPattern,
    connectTv,
    moveTv,
    clickTv,
    error,
    loading,
    clearError: () => setError(null),
  };
};

export default useMouseRemote;
