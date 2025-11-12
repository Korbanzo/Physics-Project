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

      <legend>Select A Ball</legend>
      <div className="choose-ball">
        <label htmlFor="tennisball" className="ball-option">
          <input type="radio" name="ballType" id="tennisball" defaultChecked/>
          <span className="bubble"></span>
          <span className="ball-text">Tennis Ball</span>
        </label>

        <label htmlFor="baseball" className="ball-option">
          <input type="radio" name="ballType" id="baseball"/>
          <span className="bubble"></span>
          <span className="ball-text">Baseball</span>
        </label>
      </div>



      <button onClick={onStart}>Start</button>
    </div>
  );
};

export default StartOverlay;
