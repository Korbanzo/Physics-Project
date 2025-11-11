import React from 'react';
import '../App.css';

const Paddle = React.forwardRef(({ angle, position, style }, paddleRef) => {
  return (
    <div
      ref={paddleRef}
      className="paddle"
      style={{
        position: 'absolute',
        width: '20vh',
        height: '2vh',
        backgroundColor: 'forestgreen',
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'center center',
        left: `${position.x}px`,
        top: `${position.y}px`,
        ...style,
      }}
    />
  );
});

export default Paddle;