import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Custom hook for interacting with Mouse Remote Control API
 * @returns {Object} Object containing API methods and state
 */
export const useMouseRemote = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const clearError = useCallback(() => setError(null), []);

  /**
   * Get current mouse position
   * @returns {Promise<{x: number, y: number}>}
   */
  const getCoordinates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/coordinates`);
      if (!response.ok) throw new Error('Failed to fetch coordinates');
      const data = await response.json();
      clearError();
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Error fetching coordinates';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /**
   * Click at specified coordinates
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {Promise<{status: string}>}
   */
  const click = useCallback(async (x, y) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x: parseInt(x), y: parseInt(y) })
      });

      const data = await response.json();
      
      if (!response.ok || data.status !== 'success') {
        throw new Error(data.message || 'Click failed');
      }
      
      clearError();
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Error during click';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /**
   * Move mouse by offset
   * @param {number} add_x - X offset
   * @param {number} add_y - Y offset
   * @returns {Promise<{x: number, y: number}>}
   */
  const move = useCallback(async (add_x, add_y) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          add_x: parseInt(add_x) || 0,
          add_y: parseInt(add_y) || 0
        })
      });

      if (!response.ok) throw new Error('Failed to move mouse');
      const data = await response.json();
      clearError();
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Error moving mouse';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /**
   * Reset mouse position to (10, 10)
   * @returns {Promise<{status: string}>}
   */
  const reset = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error('Reset failed');
      }
      clearError();
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Error resetting mouse';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  /**
   * Execute click pattern
   * @param {Object} options - Pattern options
   * @param {Array<Array<number>>} options.positions - Click positions [[x, y], ...]
   * @param {number} options.repeat - Times to repeat
   * @param {number} options.delay - Delay between repeats in seconds
   * @param {number} options.sleep_time - Delay between clicks in seconds
   * @param {boolean} options.automationEnabled - Enable/disable automation
   * @returns {Promise<{status: string}>}
   */
  const executeClickPattern = useCallback(async (options) => {
    setLoading(true);
    try {
      const payload = {
        positions: options.positions || [[10, 10]],
        repeat: parseInt(options.repeat) || 1,
        delay: parseFloat(options.delay) || 60,
        sleep_time: parseFloat(options.sleep_time) || 0.5,
        automationEnabled: options.automationEnabled !== false
      };

      const response = await fetch(`${API_BASE_URL}/click_pattern`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok || data.status !== 'success') {
        throw new Error(data.message || 'Pattern execution failed');
      }
      
      clearError();
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Error executing click pattern';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

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

export default useMouseRemote;
