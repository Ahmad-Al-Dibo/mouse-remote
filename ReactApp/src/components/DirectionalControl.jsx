import React from 'react'

export default function DirectionalControl(props) {
    
  return (
    <div className="card">
        <div className="step-size">
            <h2>Step size (pixels)</h2>
            <input id="stepSize" type="number" defaultValue={10} min={1} />
        </div>
        <h1 />
        <h2>Directional Control</h2>
        <div className="dpad">
            <div />
            <button >⬆️</button>
            <div />
            <button >⬅️</button>
            <button >⏺</button>
            <button >➡️</button>
            <div />
            <button >⬇️</button>
            <div />
        </div>
    </div>
  )
}
