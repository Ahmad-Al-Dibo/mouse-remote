import { useRef, useState } from 'react';
import { useMouseRemote } from './hooks/useMouseRemote';
import './App.css';

const DRAG_SCALE = 1.25;

function App() {
  const { connectTv, moveTv, clickTv, reset, loading, error, clearError } = useMouseRemote();
  const [host, setHost] = useState('local-display');
  const [target, setTarget] = useState(null);
  const [status, setStatus] = useState('Niet verbonden');
  const [lastMove, setLastMove] = useState(null);
  const dragStart = useRef(null);
  const dragMoved = useRef(false);

  const isConnected = Boolean(target?.target_id);

  const handleConnect = async () => {
    const result = await connectTv(host);
    setTarget(result);
    setStatus(result.message);
  };

  const sendMove = async (dx, dy) => {
    if (!isConnected || (dx === 0 && dy === 0)) return;
    const result = await moveTv(target.target_id, dx, dy);
    setLastMove({ x: result.x, y: result.y });
  };

  const handlePointerDown = (event) => {
    if (!isConnected) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, y: event.clientY };
    dragMoved.current = false;
  };

  const handlePointerMove = async (event) => {
    if (!dragStart.current || !isConnected) return;

    const dx = Math.round((event.clientX - dragStart.current.x) * DRAG_SCALE);
    const dy = Math.round((event.clientY - dragStart.current.y) * DRAG_SCALE);
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return;

    dragStart.current = { x: event.clientX, y: event.clientY };
    dragMoved.current = true;
    await sendMove(dx, dy);
  };

  const stopDrag = () => {
    dragStart.current = null;
  };

  const handleTapClick = async () => {
    if (!isConnected || dragMoved.current) {
      dragMoved.current = false;
      return;
    }
    await clickTv(target.target_id);
  };

  const handleReset = async () => {
    await reset();
    setLastMove({ x: 10, y: 10 });
  };

  return (
    <main className="app-container">
      <h1>🖱 TV Mouse Remote</h1>

      <section className="card connection-card">
        <h2>TV verbinding</h2>
        <p className="hint">MVP: bestuur de TV-weergave via de computer die op de TV is aangesloten.</p>
        <label htmlFor="tv-host">Target naam</label>
        <input
          id="tv-host"
          value={host}
          onChange={(event) => setHost(event.target.value)}
          disabled={loading}
        />
        <button onClick={handleConnect} disabled={loading}>
          {loading ? 'Verbinden...' : 'Connect TV'}
        </button>
        <span className={isConnected ? 'status connected' : 'status'}>{status}</span>
      </section>

      <section className="card">
        <h2>Touchpad</h2>
        <button className="click-button" onClick={() => isConnected && clickTv(target.target_id)} disabled={!isConnected || loading}>
          Klik / Selecteer
        </button>
        <div
          className={isConnected ? 'touchpad' : 'touchpad disabled'}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onClick={handleTapClick}
          role="button"
          tabIndex={0}
          aria-label="TV touchpad"
        >
          {isConnected ? 'Sleep hier om de cursor te bewegen' : 'Verbind eerst met TV'}
        </div>
      </section>

      <section className="card controls-card">
        <h2>Snelle acties</h2>
        <div className="dpad">
          <span />
          <button onClick={() => sendMove(0, -40)} disabled={!isConnected || loading}>▲</button>
          <span />
          <button onClick={() => sendMove(-40, 0)} disabled={!isConnected || loading}>◀</button>
          <button onClick={() => isConnected && clickTv(target.target_id)} disabled={!isConnected || loading}>OK</button>
          <button onClick={() => sendMove(40, 0)} disabled={!isConnected || loading}>▶</button>
          <span />
          <button onClick={() => sendMove(0, 40)} disabled={!isConnected || loading}>▼</button>
          <span />
        </div>
        <button className="reset" onClick={handleReset} disabled={loading}>Reset naar (10,10)</button>
        {lastMove && <p className="hint">Laatste positie: ({lastMove.x}, {lastMove.y})</p>}
      </section>

      {error && (
        <div className="error-message" role="alert">
          ⚠️ {error}
          <button onClick={clearError}>Sluit</button>
        </div>
      )}
    </main>
  );
}

export default App;
