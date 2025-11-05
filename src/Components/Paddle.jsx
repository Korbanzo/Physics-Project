import React from 'react';
import '../App.css';

const Paddle = React.forwardRef(({ angle, style }, paddleRef) => {
    return (
    <div
      ref={paddleRef}
      className="paddle"
      style={{
        position: 'absolute',
        bottom: '10%',
        left: '2%',
        width: '20vh',
        height: '2vh',
        backgroundColor: 'forestgreen',
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'center center',
        ...style,
      }}
    />
  );
});

export default Paddle;
