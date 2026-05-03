import React from 'react'

export default function Settings(props) {
const { 
    automationActive,
    automationStatus,
    repeatCount,
    sleepTime,
    delay,

    setSleepTime,
    setRepeatCount, // implemented 
    setDelay, 
    setAutomationActive} = props;

    const switchAutomatation = () => {
        automationStatus();
        setAutomationActive(!automationActive);
    }

  return (
    <div className="active-automatation">
        <h2>{automationActive ? "Active" : "Inactive"} Automation</h2>
        <span className="automationStatus" id="automationStatus">
        {automationActive ? "ON" : "OFF"}
        </span>
        <span className="positions" id="pattern" />
        <div id="activeAutomatation" className="automatation-list">
            {/* Active automatations will be listed here*/}
            <div className="settings">
                {/* REPEAT */}
                <label htmlFor="repeat">Repeat:</label>
                <input id="repeat" type="number" onChange={(e)=>{
                    setRepeatCount(e.target.value)
                }} defaultValue={1} min={1} />
                {/* SLEEP-TIME */}
                <label htmlFor="sleep_time">Sleep Time (s):</label>
                <input id="sleep_time" type="number" onChange={(e)=>{
                    setSleepTime(e.target.value);
                }} defaultValue="0.5" min={0} step="0.1" />
                {/* DELAY */}
                <label htmlFor="delay">Delay (s):</label>
                <input id="delay" type="number" onChange={(e)=>{
                    setDelay(e.target.value);
                }} defaultValue={60} min={0} />
            </div>
            <button onClick={switchAutomatation}>Switch Automatation</button>
            <button >Click Pattern</button>
            <button >Show Pattern</button>
            <button >Clear Automatation</button>
        </div>
    </div>
  )
}
