import React from 'react';
import '../App.css';

const StartOverlay = ({ angle, setAngle, onStart, ballType, setBallType }) => {
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
        <label htmlFor="Perfectly Elastic" className="ball-option">
          <input type="radio" name="ballType" id="Perfectly Elastic" value="Perfectly Elastic" checked={ballType === 'Perfectly Elastic'} onChange={(e) => setBallType(e.target.value)}/>
          <span className="bubble"></span>
          <span className="ball-text">Perfectly Elastic</span>
        </label>

        <label htmlFor="Tennis" className="ball-option">
          <input type="radio" name="ballType" id="Tennis" value="Tennis" checked={ballType === 'Tennis'} onChange={(e) => setBallType(e.target.value)}/>
          <span className="bubble"></span>
          <span className="ball-text">Tennis Ball</span>
        </label>

        <label htmlFor="Baseball" className="ball-option">
          <input type="radio" name="ballType" id="Baseball" value="Baseball" checked={ballType === 'Baseball'} onChange={(e) => setBallType(e.target.value)}/>
          <span className="bubble"></span>
          <span className="ball-text">Baseball</span>
        </label>        
        
        <label htmlFor="Perfectly Inelastic" className="ball-option">
          <input type="radio" name="ballType" id="Perfectly Inelastic" value="Perfectly Inelastic" checked={ballType === 'Perfectly Inelastic'} onChange={(e) => setBallType(e.target.value)}/>
          <span className="bubble"></span>
          <span className="ball-text">Perfectly Inelastic</span>
        </label>
      </div>





      <button onClick={onStart}>Start</button>
    </div>
  );
};

export default StartOverlay;
