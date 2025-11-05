import React from 'react';
import '../App.css';

const StartOverlay = ({ angle, setAngle, onStart }) => {
  return (
    <div className="overlay">
      <h2>Set Paddle Angle</h2>
      <input
        type="range"
        min="0"
        max="360"
        value={angle}
        onChange={(e) => setAngle(parseFloat(e.target.value))}
      />

      <p>{angle.toFixed(1)}°</p>
      <button onClick={onStart}>Start</button>
    </div>
  );
}

export default StartOverlay;